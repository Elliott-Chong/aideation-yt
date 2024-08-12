import CreateNoteDialog from "@/components/CreateNoteDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GetServerSideProps } from "next";

type Props = {
  notes: Array<{
    id: number;
    name: string;
    imageUrl: string | null;
    createdAt: string;
  }>;
};

const DashboardPage = ({ notes }: Props) => {
  return (
    <div className="grainy min-h-screen">
      <div className="max-w-7xl mx-auto p-10">
        <div className="h-14"></div>
        <div className="flex justify-between items-center md:flex-row flex-col">
          <div className="flex items-center">
            <Link href="/">
              <Button className="bg-green-600" size="sm">
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="w-4"></div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <div className="w-4"></div>
            <UserButton />
          </div>
        </div>

        <div className="h-8"></div>
        <Separator />
        <div className="h-8"></div>

        {notes.length === 0 && (
          <div className="text-center">
            <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
          </div>
        )}

        <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
          <CreateNoteDialog />
          {notes.map((note) => (
            <a href={`/notebook/${note.id}`} key={note.id}>
              <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                <Image
                  width={400}
                  height={200}
                  alt={note.name}
                  src={note.imageUrl || ""}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {note.name}
                  </h3>
                  <div className="h-1"></div>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Server-side function to fetch data on every request
export const getServerSideProps: GetServerSideProps = async () => {
  const { userId } = auth();

  // Fetch the notes for the authenticated user
  const notes = await db
    .select({
      id: $notes.id,
      name: $notes.name,
      imageUrl: $notes.imageUrl,
      createdAt: $notes.createdAt,
    })
    .from($notes)
    .where(eq($notes.userId, userId!));

  return {
    props: {
      notes: notes.map((note) => ({
        id: note.id,
        name: note.name,
        imageUrl: note.imageUrl,
        createdAt: note.createdAt.toISOString(),
      })),
    },
  };
};

export default DashboardPage;
