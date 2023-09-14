import router from "next/router";
import {useEffect} from "react";
import {useForm} from "react-hook-form";

export default function FormLayout({
  requiredFields,
  children,
}: {
  requiredFields: {[k: string]: string};
  children: React.ReactNode;
}) {
  const form = useForm({defaultValues: requiredFields});
  useEffect(() => {
    if (Object.keys(router.query).length === 0) router.push("/");
  }, []);
  return children;
}
