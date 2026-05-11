import { connect } from "@/dbconfig/dbconfig";
import Users from "@/models/users.models";
import SedanClean from "@/models/pricing-models/sedanClean.models";
import SedanShine from "@/models/pricing-models/sedanShine.models";
import SuvClean from "@/models/pricing-models/suvClean.models";
import SuvShine from "@/models/pricing-models/suvShine.models";
import Bike from "@/models/pricing-models/bike.models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminEmail = String(session.user.email).toLowerCase();
    const adminUser = await Users.findOne({ email: adminEmail }).select("role");

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { planId, planType, field, value } = await request.json();

    if (!planId || !planType || !field || value === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: planId, planType, field, value" },
        { status: 400 }
      );
    }

    type PlanModel = typeof SedanClean;
    const planModels: Record<string, PlanModel> = {
      sedanClean: SedanClean,
      sedanShine: SedanShine,
      suvClean: SuvClean,
      suvShine: SuvShine,
      bike: Bike,
    };

    const selectedModel = planModels[planType];
    if (!selectedModel) {
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    // Validate field name
    const validFields = ["wash", "interiorClean", "dashboard", "tyrePolish", "wax"];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { message: `Invalid field. Must be one of: ${validFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (planType === "bike" && !["wash", "wax"].includes(field)) {
      return NextResponse.json(
        { message: "Invalid field for bike plan" },
        { status: 400 }
      );
    }

    // Validate value constraints
    const constraints: { [key: string]: { min: number; max: number } } = {
      wash: { min: 0, max: 20 },
      interiorClean: { min: 0, max: planType.includes("shine") ? 4 : 2 },
      dashboard: { min: 0, max: 2 },
      tyrePolish: { min: 0, max: planType.includes("shine") ? 4 : 2 },
      wax: { min: 0, max: 2 },
    };

    const constraint = constraints[field];
    if (value < constraint.min || value > constraint.max) {
      return NextResponse.json(
        { message: `${field} must be between ${constraint.min} and ${constraint.max}` },
        { status: 400 }
      );
    }

    // Update the plan
    const updatedPlan = await selectedModel.findByIdAndUpdate(
      planId,
      { [field]: value },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { message: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Plan updated successfully",
        plan: {
          planId: String(updatedPlan._id),
          planType,
          wash: updatedPlan.wash ?? 0,
          interiorClean: updatedPlan.interiorClean ?? 0,
          dashboard: updatedPlan.dashboard ?? 0,
          tyrePolish: updatedPlan.tyrePolish ?? 0,
          wax: updatedPlan.wax ?? 0,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update plan error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Internal error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
