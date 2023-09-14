import Navbar from "@/components/nabar";
import {Button} from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import Lottie from "react-lottie-player";
import {z} from "zod";
import dark from "../assets/dark.json";

export const DetailsSchema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/,
      "Please enter a valid phone number"
    ),
  age: z.string().refine(
    (v) => {
      const parsed = parseInt(v);
      return !isNaN(parsed) && parsed > 0;
    },
    {message: "A Valid Age is Required"}
  ),
});

export default function Details() {
  const form = useForm<z.infer<typeof DetailsSchema>>({
    defaultValues: {age: "", phone: ""},
    resolver: zodResolver(DetailsSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(router.query).length === 0) router.push("/");
  }, []);

  function onSubmit(a: any) {
    router.push({pathname: "/localisation", query: {...router.query, ...a}});
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
        <p className="text-xl font-bold tracking-tight pb-4">
          Step 2: Still, tell us more.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Age"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormDescription>
                    {"We won't reveal your age also "}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
            <Button type="submit" variant={"outline"}>
              Next
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
