import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const demographicsSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  age: z.string().min(1, "Required"),
  sex: z.enum(["male", "female", "intersex", "prefer-not-to-say"]),
  education: z.string().min(1, "Required"),
  language: z.string().min(1, "Required"),
  handedness: z.enum(["right", "left", "ambidextrous"]),
  yearsEducation: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const parsed = Number(val);
        return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 40;
      },
      { message: "Enter a number between 0 and 40" }
    ),
  country: z.string().optional(),
  additionalLanguages: z.string().optional(),
  englishPrimary: z.enum(["yes", "no", "prefer-not"]).optional(),
  raceEthnicity: z.string().optional(),
  occupation: z.string().optional(),
  learningHistory: z.string().optional(),
  sensoryDifficulty: z.enum(["none", "vision", "hearing", "both", "prefer-not"]).optional(),
});

interface DemographicsFormProps {
  onComplete: (data: z.infer<typeof demographicsSchema>) => void;
  defaultValues?: Partial<z.infer<typeof demographicsSchema>>;
}

export function DemographicsForm({ onComplete, defaultValues }: DemographicsFormProps) {
  const form = useForm<z.infer<typeof demographicsSchema>>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      education: "",
      language: "English",
      sex: "male",
      handedness: "right",
       yearsEducation: "",
       country: "",
       additionalLanguages: "",
       englishPrimary: "yes",
       raceEthnicity: "",
       occupation: "",
       learningHistory: "",
       sensoryDifficulty: "none",
      ...defaultValues
    },
  });

  return (
    <div className="flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-3xl">
        <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-slate-500 text-center">
          Step 1 of 4 · Demographics
        </p>
        <Card className="w-full max-w-2xl mx-auto rounded-3xl bg-white shadow-sm border border-slate-100 px-6 md:px-10 py-8 md:py-10">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Demographic Profile</h2>
            <p className="mt-1 text-sm text-slate-600 text-center max-w-md mx-auto">
              Basic background information used to choose the right comparison group and interpret your cognitive results.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onComplete)} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">First Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Last Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Age</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Biological Sex</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="intersex">Intersex</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Highest Degree Obtained</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12">High School / GED</SelectItem>
                          <SelectItem value="14">Associate's Degree</SelectItem>
                          <SelectItem value="16">Bachelor's Degree</SelectItem>
                          <SelectItem value="18">Master's Degree</SelectItem>
                          <SelectItem value="20">Doctoral Degree</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearsEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Years of formal education (optional)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 16" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Primary Language</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalLanguages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Additional languages (optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Spanish, French" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handedness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Handedness</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="ambidextrous">Ambidextrous</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">Country / Region (optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., United States" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="englishPrimary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">
                        Is English your primary language? (optional)
                      </FormLabel>
                      <RadioGroup
                        className="flex flex-wrap gap-4"
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        {[
                          { label: "Yes", value: "yes" },
                          { label: "No", value: "no" },
                          { label: "Prefer not to say", value: "prefer-not" },
                        ].map((opt) => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`english-${opt.value}`} />
                            <Label htmlFor={`english-${opt.value}`}>{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 border-t border-dashed border-slate-200 pt-4 mt-2 text-[11px] uppercase tracking-wide text-slate-500">
                  Optional background details
                </div>

                <FormField
                  control={form.control}
                  name="raceEthnicity"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">
                        Race / Ethnicity (optional)
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="black">Black or African American</SelectItem>
                          <SelectItem value="hispanic">Hispanic / Latino</SelectItem>
                          <SelectItem value="pacific-islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="multiracial">Multiracial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not">Prefer not to answer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">
                        Current occupation or work status (optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Engineer, Retired, On disability" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="learningHistory"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">
                        History of learning differences or attention diagnoses (optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="e.g., ADHD diagnosis, dyslexia, none, prefer not to say"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sensoryDifficulty"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-slate-700 mb-1">
                        Significant vision or hearing difficulties (optional)
                      </FormLabel>
                      <p className="text-[11px] text-slate-500 mb-2">
                        This helps us interpret test performance if sensory issues may affect speed or accuracy.
                      </p>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No</SelectItem>
                          <SelectItem value="vision">Yes – vision</SelectItem>
                          <SelectItem value="hearing">Yes – hearing</SelectItem>
                          <SelectItem value="both">Yes – both</SelectItem>
                          <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-slate-900 text-white py-3 text-sm font-semibold hover:bg-slate-800"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-2 text-[11px] text-slate-500 text-center">
                  You&apos;ll be able to review these answers later in the assessment.
                </p>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
