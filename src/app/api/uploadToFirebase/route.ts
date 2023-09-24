import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { noteId } = await req.json();
    // extract out the dalle imageurl
    // save it to firebase
    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));
    if (!notes[0].imageUrl) {
      return new NextResponse("no image url", { status: 400 });
    }
    const firebase_url = await uploadFileToFirebase(
      notes[0].imageUrl,
      notes[0].name
    );
    // update the note with the firebase url
    await db
      .update($notes)
      .set({
        imageUrl: firebase_url,
      })
      .where(eq($notes.id, parseInt(noteId)));
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("error", { status: 500 });
  }
}
