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

const PLAN_LIMITS: Record<string, Record<string, number>> = {
  sedanClean: { wash: 20, interiorClean: 2, dashboard: 2, tyrePolish: 2 },
  sedanShine: { wash: 20, interiorClean: 4, dashboard: 2, tyrePolish: 4 },
  suvClean: { wash: 20, interiorClean: 2, dashboard: 2, tyrePolish: 2 },
  suvShine: { wash: 20, interiorClean: 4, dashboard: 2, tyrePolish: 4 },
  bike: { wash: 20, wax: 2 },
};

type PlanModel = typeof SedanClean;
const PLAN_MODEL_MAP: Record<string, PlanModel> = {
  sedanClean: SedanClean,
  sedanShine: SedanShine,
  suvClean: SuvClean,
  suvShine: SuvShine,
  bike: Bike,
};

export async function POST(request: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planName, vehicleCategory } = await request.json();

    if (!planName || !vehicleCategory) {
      return NextResponse.json(
        { message: "Missing required fields: planName, vehicleCategory" },
        { status: 400 }
      );
    }

    const userEmail = String(session.user.email).toLowerCase();
    const user = await Users.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let planType = "";

    if (planName === "CLEAN CARE" && vehicleCategory === "Sedan") {
      planType = "sedanClean";
    } else if (planName === "CLEAN CARE" && vehicleCategory === "SUV") {
      planType = "suvClean";
    } else if (planName === "SHINE CARE" && vehicleCategory === "Sedan") {
      planType = "sedanShine";
    } else if (planName === "SHINE CARE" && vehicleCategory === "SUV") {
      planType = "suvShine";
    } else if (planName === "BIKE CARE") {
      planType = "bike";
    } else {
      return NextResponse.json(
        { message: "Unsupported plan selection" },
        { status: 400 }
      );
    }

    const planModel = PLAN_MODEL_MAP[planType];
    const planLimits = PLAN_LIMITS[planType];

    if (!planModel || !planLimits) {
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    const planDoc = await planModel.create({
      user: user._id,
      ...planLimits,
    });

    const planEntry = {
      planType,
      planId: planDoc._id,
    };

    user.plan = Array.isArray(user.plan) ? [...user.plan, planEntry] : [planEntry];
    await user.save();

    return NextResponse.json(
      {
        message: "Plan assigned successfully",
        plan: {
          planType,
          planId: String(planDoc._id),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Assign plan error:", error);

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
