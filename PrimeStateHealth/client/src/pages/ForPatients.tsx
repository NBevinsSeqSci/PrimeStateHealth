import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CTA } from "@/lib/cta";

export default function ForPatientsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-6">
        <Card className="w-full p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              For Patients
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              A quick check-in for your brain
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl">
            A short set of on-screen tasks that helps you see how your brain is
            doing today and track changes over time.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              10-20 minutes
            </span>
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              No needles
            </span>
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              Repeatable
            </span>
          </div>
          <div className="pt-2">
            <Link href={CTA.primary.href}>
              <Button size="lg" className="w-full sm:w-auto">
                {CTA.primary.label}
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Quick Facts
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What to expect
            </h2>
          </div>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span><span className="font-semibold">Time:</span> 10-20 minutes</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span><span className="font-semibold">Where:</span> Tablet or computer</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span><span className="font-semibold">Comfort:</span> Self-administered with on-screen guidance</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span><span className="font-semibold">Repeat:</span> Safe to repeat to track trends</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Overview
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What is it?
            </h2>
          </div>
          <p className="text-slate-600">
            This is a simple set of tasks. You tap or click on the screen.
          </p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Complete it on a tablet or computer.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Self-administered with on-screen guidance.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>You can pause or stop anytime.</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Measures
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What it checks
            </h2>
          </div>
          <p className="text-slate-600">We look at common brain skills:</p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Attention and focus</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Speed of thinking</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Memory</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Flexible thinking</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Self-control</span>
            </li>
          </ul>
          <p className="text-slate-600">
            We also ask short questions about sleep, mood, and stress. These can
            affect how you feel and how you perform.
          </p>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Reasons
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Why people do it
            </h2>
          </div>
          <p className="text-slate-600">People use this to:</p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Understand brain fog or "feeling off"</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Set a baseline</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Track change after lifestyle or care plan changes</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Have a clearer talk with their provider</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Results
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What you get
            </h2>
          </div>
          <p className="text-slate-600">You get a simple summary that shows:</p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Your strengths</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Areas to support</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>How today compares to typical ranges for age</span>
            </li>
          </ul>
          <p className="text-slate-600">Repeat tests can show trends over time.</p>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Limits
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What this test cannot do
            </h2>
          </div>
          <p className="text-slate-600">This is a screening and tracking tool.</p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>It does not diagnose a condition.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>It does not replace formal neuro or psych testing.</span>
            </li>
          </ul>
          <p className="text-slate-600">
            If results are concerning, your provider may suggest follow-up.
          </p>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Privacy
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Privacy
            </h2>
          </div>
          <p className="text-slate-600">
            Your results are kept private as part of your health record. Share
            them only with people you choose, such as your care team.
          </p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Stored in your medical record.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Shared only with people you choose.</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Before You Start
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Get ready
            </h2>
          </div>
          <p className="text-slate-600">For the best result:</p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Use a quiet room.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Wear glasses or contacts if needed.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Avoid rushing right after hard exercise.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Do your best, not perfect.</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Next Steps
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              What happens next
            </h2>
          </div>
          <p className="text-slate-600">
            Review your results with your care team. Together you can decide on
            next steps. Repeat testing can help you track progress.
          </p>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Review results with your care team.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Choose next steps with your provider.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>Repeat to track progress over time.</span>
            </li>
          </ul>
        </Card>

        <Card className="w-full p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              FAQ
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Common questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="diagnosis">
              <AccordionTrigger>Is this a diagnosis?</AccordionTrigger>
              <AccordionContent>
                No. It is a screening and tracking tool. Results need clinical
                context.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="affects-score">
              <AccordionTrigger>What can affect my score?</AccordionTrigger>
              <AccordionContent>
                Sleep, stress, mood, medications, pain, illness, caffeine, and
                distractions can all affect performance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="repeat">
              <AccordionTrigger>Can I repeat the test?</AccordionTrigger>
              <AccordionContent>
                Yes. Repeating the test is useful for tracking trends over time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="concerning">
              <AccordionTrigger>What if my results look concerning?</AccordionTrigger>
              <AccordionContent>
                Share them with your provider. They may suggest follow-up or
                additional testing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </main>
  );
}
