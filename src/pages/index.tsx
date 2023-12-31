import Navbar from "@/components/nabar";
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
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {z} from "zod";
import Lottie from "react-lottie-player";
import dark from "../assets/dark.json";
import light from "../assets/light.json";

export const MainSchema = z.object({
  username: z.string().min(3, "Username has to be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export default function Home() {
  const form = useForm<z.infer<typeof MainSchema>>({
    defaultValues: {username: "", email: ""},
    resolver: zodResolver(MainSchema),
  });
  const router = useRouter();

  function onSubmit(data: any) {
    router.push({pathname: "/details", query: data});
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
          Step 1: Tell Us More About You.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We will never share your email. Ever.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div />
            <Button type="submit" variant={"outline"}>
              Next
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
