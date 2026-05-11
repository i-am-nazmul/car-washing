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

export async function GET(request: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    let userQuery: { _id?: string; email?: string } = {};

    if (requestedUserId) {
      const adminEmail = String(session.user.email).toLowerCase();
      const adminUser = await Users.findOne({ email: adminEmail }).select("role");

      if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden: Admin access required" },
          { status: 403 }
        );
      }

      userQuery = { _id: requestedUserId };
    } else {
      const userEmail = String(session.user.email).toLowerCase();
      userQuery = { email: userEmail };
    }

    const user = await Users.findOne(userQuery).select("plan");

    if (!user || !user.plan || user.plan.length === 0) {
      return NextResponse.json(
        { plans: [] },
        { status: 200 }
      );
    }

    const planEntries = Array.isArray(user.plan) ? user.plan : [];

    const normalizedPlans = planEntries.map((entry: unknown) => {
      if (entry && typeof entry === "object" && "planType" in entry && "planId" in entry) {
        return { planType: entry.planType, planId: String(entry.planId) };
      }
      return { planType: "sedanClean", planId: String(entry) };
    });

    type PlanModel = typeof SedanClean;
    const planMap: Record<string, { name: string; model: PlanModel }> = {
      sedanClean: { name: "Sedan Clean", model: SedanClean },
      sedanShine: { name: "Sedan Shine", model: SedanShine },
      suvClean: { name: "SUV Clean", model: SuvClean },
      suvShine: { name: "SUV Shine", model: SuvShine },
      bike: { name: "Bike", model: Bike },
    };

    const plans = await Promise.all(
      normalizedPlans.map(async (entry) => {
        const planConfig = planMap[entry.planType];
        if (!planConfig) {
          return null;
        }
        const planDoc = await planConfig.model.findById(entry.planId);
        if (!planDoc) {
          return null;
        }
        return {
          planType: entry.planType,
          planName: planConfig.name,
          planId: String(planDoc._id),
          wash: planDoc.wash ?? 0,
          interiorClean: planDoc.interiorClean ?? 0,
          dashboard: planDoc.dashboard ?? 0,
          tyrePolish: planDoc.tyrePolish ?? 0,
          wax: planDoc.wax ?? 0,
        };
      })
    );

    return NextResponse.json(
      { plans: plans.filter(Boolean) },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetch plans error:", error);

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
