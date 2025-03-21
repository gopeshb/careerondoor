"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin"); // Redirect to Sign In after logout
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">My Profile</h2>

        {/* User Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
        </div>

        {/* User Info */}
        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold text-gray-700">{user.firstName} {user.lastName}</p>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.admin && <p className="text-red-600 font-semibold">Admin</p>}
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full bg-red-600 text-white border-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
