import Link from "next/link";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useEffect} from "react";
import {useRouter} from "next/router";
import Navbar from "@/components/nabar";
import Lottie from "react-lottie-player";
import dark from "../assets/dark.json";

export const LanguageSchema = z.object({
  language: z.string(),
});

export default function SelectForm() {
  const form = useForm<z.infer<typeof LanguageSchema>>({
    resolver: zodResolver(LanguageSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(router.query).length === 0) router.push("/");
  }, []);

  async function onSubmit(data: z.infer<typeof LanguageSchema>) {
    const res = await fetch("/api/writeData", {
      body: JSON.stringify({...router.query, ...data}),
      method: "POST",
    });
    const body = await res.json();
    router.push({
      pathname: `/${data.language}/ticket`,
      query: {runningNumber: body?.runningNumber},
    });
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2  h-screen w-screen relative isolate">
      <Navbar />
      <div
        className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      <div className="top-0 left-0 items-center justify-center hidden md:flex">
        <div className="">
          <Lottie
            style={{width: 550, height: 550}}
            animationData={dark}
            loop
            play
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 min-h-screen p-4 md:max-w-sm max-w-md m-auto justify-center w-full">
        <p className="text-xl font-bold tracking-tight mb-4">
          Step 3: Your preferred language ?
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          placeholder="Select your preferred language"
                          className="bg-background"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bm">Bahasa Malaysia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your preferred language
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
