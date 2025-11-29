import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStrapiURL } from "@/lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  } 

  try {
    const { id } = await params;
    const baseUrl = getStrapiURL();

    const response = await fetch(`${baseUrl}/api/upload/files/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
