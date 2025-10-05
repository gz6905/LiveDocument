"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";

const UserMenu = () => {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  );
};

export default UserMenu;
