import * as React from "react";
import {ChevronDownIcon, DownloadIcon, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {useRouter} from "next/router";
import {Label} from "@/components/ui/label";
import TicketNavbar from "@/components/ticket-navbar";
import DataTable from "@/components/data-table";
import {promises as fs} from "fs";
import path from "path";

export type TFormFields = {
  runningNumber: number;
  language: string;
  email: string;
  date: string;
  phone: string;
  username: string;
  age: string;
};

async function fetchPreData(runningNumber: string) {
  const count = await fetch(`${process.env.VERCEL_APP}/api/readCount`);
  const latestRec = await fetch(
    `${process.env.VERCEL_APP}/api/readLatestRecord`,
    {
      body: JSON.stringify({runningNumber}),
      method: "POST",
    }
  );

  return {
    latestRec: ((await latestRec.json())?.data || {}) as TFormFields,
    count: (await count.json())?.count as number,
  };
}

export async function getServerSideProps(props: any) {
  const jsonDirectory = path.join(process.cwd(), "public/locales");
  const fileContents = await fs.readFile(
    jsonDirectory + "/common.json",
    "utf8"
  );
  const params = new URLSearchParams(props.req.url.split("?")[1]);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["prefetchData"],
    async () => await fetchPreData(params?.get("runningNumber") as string)
  );

  return {
    props: {
      locales: JSON.parse(fileContents),
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function useTranslation(locales: {[k: string]: {[k: string]: string}}) {
  const router = useRouter();
  return {
    t: (k: string) => locales[(router?.query?.lang as string) || "en"][k],
  };
}

export default function Ticket({locales}: any) {
  const {t} = useTranslation(locales);
  const router = useRouter();
  const {data, isLoading, isIdle, mutate} = useMutation({
    mutationKey: ["readRecord"],
    mutationFn: async () => (await fetch("/api/readRecord")).json(),
  });
  const {data: prefetchData} = useQuery({
    queryKey: ["prefetchData"],
    queryFn: () => fetchPreData((router?.query?.runningNumber as string) || ""),
    enabled: false,
  });

  return (
    <React.Fragment>
      <TicketNavbar />
      <div className="p-4">
        <div className="h-screen flex items-center justify-center relative">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] dark:from-pink-800 dark:to-indigo-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="absolute bottom-10 animate-bounce flex items-center flex-col text-xs inset-x-0 text-muted-foreground">
            <ChevronDownIcon className="w-4 h-4" />
            {t("yourPastRecords")}
          </div>
          <div className="flex flex-col space-y-2">
            {!Boolean(prefetchData?.latestRec.runningNumber) && (
              <p>{t("noRecordsFound")}</p>
            )}
            {Boolean(prefetchData?.latestRec?.runningNumber) && (
              <Card className="max-w-md animate-in fade-in-50 w-full">
                <CardHeader>
                  <CardTitle>
                    <span className="mr-1 md:mr-3">🎉 </span>
                    {t("submissionReceived")}
                  </CardTitle>
                  <CardDescription>{t("submissionDetails")}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: t("username"),
                      value: prefetchData?.latestRec?.username,
                    },
                    {
                      title: t("runningNumber"),
                      value: prefetchData?.latestRec?.runningNumber,
                    },
                    {
                      title: t("email"),
                      value: prefetchData?.latestRec?.email,
                    },
                    {title: t("age"), value: prefetchData?.latestRec?.age},
                    {
                      title: t("phoneNumber"),
                      value: prefetchData?.latestRec?.phone,
                    },
                    {
                      title: t("preferredLanguage"),
                      value: prefetchData?.latestRec?.language,
                    },
                  ].map(({title, value}) => (
                    <div className="flex space-y-1 flex-col" key={title}>
                      <Label htmlFor={title} className="text-muted-foreground">
                        {title}
                      </Label>
                      <div className="text-xs">{value}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="min-h-screen flex flex-col space-y-8 max-w-7xl m-auto pt-20">
          <div className="flex md:flex-row flex-col items-start md:items-center justify-between space-y-2 w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="mr-2">{prefetchData?.count}</span>
                {t("recordSubmission")}
              </h2>
              <p className="text-muted-foreground">{t("listOfRecords")}</p>
            </div>
          </div>
          <div className="overflow-y-auto relative rounded-lg w-full">
            <DataTable
              data={data?.data || []}
              onFetchRecords={() => mutate()}
            />
            {(isIdle || isLoading || data?.data?.length === 0) && (
              <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
                {data?.data?.length > 0 ? (
                  <p className="text-xs">{t("fetchingRecords")}</p>
                ) : (
                  <div>
                    <Button
                      onClick={() => mutate()}
                      variant={"outline"}
                      size={"sm"}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      {t("fetchAllRecords")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
