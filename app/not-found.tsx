import type { Metadata } from "next";
import NotFoundDialog from "../components/os/NotFoundDialog";

export const metadata: Metadata = {
  title: "Error 404 · Newt OS",
};

export default function NotFound() {
  return <NotFoundDialog />;
}
