"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/userSlice";

export default function TokenWatcher() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user?.tokenExpiry) return;

    const now = Date.now();
    const remaining = user.tokenExpiry - now;

    if (remaining <= 0) {
      dispatch(logout());
    } else {
      const timeout = setTimeout(() => {
        dispatch(logout());
      }, remaining);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [user?.tokenExpiry]);

  return null;
}
