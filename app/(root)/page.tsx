import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import UserMenu from "@/components/UserMenu";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import Notifications from "@/components/Notifications";
import DocumentList from "@/components/DocumentList";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in"); // Keep this

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <UserMenu />
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <DocumentList 
          documents={roomDocuments.data} 
          clerkUser={{
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress
          }} 
        />
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document icon"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
