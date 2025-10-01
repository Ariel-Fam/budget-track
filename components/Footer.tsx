import Image from "next/image";
import Link from "next/link";
import { CircleDollarSign, PiggyBank, LineChart, Target } from "lucide-react";

function Footer() {
    return (
        <footer className="border-t">
            <div className="mx-auto  w-screen px-4 py-10 bg-blue-900/55">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3 ">
                        <div className="flex items-center gap-2">
                            <Image src="/softwareLogo.png" alt="Budget Track logo" width={1400} height={36} />
                            
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A simple, privacy‑friendly tool to record expenses, savings, investments, and savings goals
                            with instant visual feedback on your dashboard.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-wide">Features</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2"><CircleDollarSign className="size-4" /> Expense tracking</li>
                            <li className="flex items-center gap-2"><PiggyBank className="size-4" /> Savings logging</li>
                            <li className="flex items-center gap-2"><LineChart className="size-4" /> Investment records</li>
                            <li className="flex items-center gap-2"><Target className="size-4" /> Savings goals</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-wide">About</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Built with Next.js, Prisma, and shadcn/ui</li>
                            <li>Local SQLite storage for fast, simple setup</li>
                            <li>Charts to visualize trends and progress</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-wide">Get started</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-foreground hover:underline">Open the dashboard</Link>
                            </li>
                            <li className="text-muted-foreground">Add expenses, savings, and investments</li>
                            <li className="text-muted-foreground">Set goals and track progress</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t pt-6">
                    <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Budget Track. All rights reserved.</p>
                    <div className="text-xs text-muted-foreground">
                        <span>Made for personal finance clarity.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;