"use client"

import { IoArrowBack } from "react-icons/io5"
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function NavHeader({ pageName, isNav = true , Component }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleBack = () => {
        if (isPending) return;
        startTransition(() => {
            router.back();
        })
    }

    return (
        <div className="sticky top-0 z-999 background text flex items-center gap-4 border-b px-4 py-4 mb-6">

            {
                isNav && (
                    <button onClick={() => handleBack()} disabled={isPending} className="flex items-center justify-center w-10 h-10 rounded-full border active:scale-95 transition">

                        {isPending ? "Loading..." : (<IoArrowBack size={22} />)}

                    </button>)
            }

            <h1 className="text-2xl font-semibold">
                {pageName}
            </h1>

        </div>
    )
}