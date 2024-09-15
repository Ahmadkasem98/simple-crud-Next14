import { Databases, ID, Query } from "appwrite";
import client from "../../../../../lib/appwrite_client";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create Interpretation
async function fetchInterpretion(id: string) {
  try {
    const interpretation = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return interpretation;
  } catch (error) {
    console.log(error);
    console.error("Error fetch interpretation", error);
    throw new Error("Failed to fetch interpretation");
  }
}

async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting interpretation", error);
    throw new Error("Failed to delete interpretation");
  }
}

// Update a specific interpretation

async function updateInterpretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id,
      data
    );
    return response;
  } catch (error) {
    console.error("Error deleting interpretation", error);
    throw new Error("Failed to delete interpretation");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await fetchInterpretion(id);
    return NextResponse.json({ interpretation });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterpretation(id);
    return NextResponse.json({ message: "interpretation Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to Delete interpretation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await req.json();
    await updateInterpretation(id, interpretation);
    return NextResponse.json({ message: "interpretation Updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
