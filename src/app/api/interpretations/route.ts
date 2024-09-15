import { Databases, ID, Query } from "appwrite";
import client from "../../../../lib/appwrite_client";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create Interpretation
async function createInterpretion(data: {
  term: string;
  Interpretation: string;
}) {
  console.log("out", data);
  try {
    console.log("in:", data);

    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      ID.unique(),
      data
    );
    console.log("response:", response);
    return response;
  } catch (error) {
    console.log(error);
    console.error("Error creating interpretation", error);
    throw new Error("Failed to create interpretation");
  }
}

//Fetch Interpretation

async function fetchInterpretion() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error Fetch interpretation", error);
    throw new Error("Failed to Fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    debugger;
    const { term, Interpretation } = await req.json();

    const data = { term, Interpretation };
    console.log(data);
    const response = await createInterpretion(data);
    return NextResponse.json({ message: "interpretation created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create interpretation",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await fetchInterpretion();
    return NextResponse.json(interpretations);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch interpretation",
      },
      { status: 500 }
    );
  }
}
