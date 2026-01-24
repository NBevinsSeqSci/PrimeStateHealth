import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OrientationTest({ onComplete }: { onComplete: (score: number) => void }) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [dateNumber, setDateNumber] = useState("");
  const [day, setDay] = useState("");
  const [season, setSeason] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  const dayOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

  const seasonOptions = ["Spring", "Summer", "Autumn/Fall", "Winter"] as const;

  const timeOfDayOptions = ["Morning", "Afternoon", "Evening", "Night"] as const;

  const getCurrentSeason = (monthIndex: number): (typeof seasonOptions)[number] => {
    if (monthIndex === 11 || monthIndex <= 1) return "Winter";
    if (monthIndex >= 2 && monthIndex <= 4) return "Spring";
    if (monthIndex >= 5 && monthIndex <= 7) return "Summer";
    return "Autumn/Fall";
  };

  const getCurrentTimeOfDay = (hour: number): (typeof timeOfDayOptions)[number] => {
    if (hour >= 5 && hour <= 11) return "Morning";
    if (hour >= 12 && hour <= 16) return "Afternoon";
    if (hour >= 17 && hour <= 20) return "Evening";
    return "Night";
  };

  const handleSubmit = () => {
    const now = new Date();
    let score = 0;

    const enteredYear = Number(year);
    if (!Number.isNaN(enteredYear) && enteredYear === now.getFullYear()) {
      score += 1;
    }

    const currentMonthName = monthOptions[now.getMonth()];
    if (month === currentMonthName) {
      score += 1;
    }

    const enteredDate = Number(dateNumber);
    if (!Number.isNaN(enteredDate) && enteredDate === now.getDate()) {
      score += 1;
    }

    const currentDayName = dayOptions[now.getDay()];
    if (day === currentDayName) {
      score += 1;
    }

    const currentSeason = getCurrentSeason(now.getMonth());
    if (season === currentSeason) {
      score += 1;
    }

    const currentTimeOfDay = getCurrentTimeOfDay(now.getHours());
    if (timeOfDay === currentTimeOfDay) {
      score += 1;
    }

    onComplete(score);
  };

  const isComplete = year && month && dateNumber && day && season && timeOfDay;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-primary">Orientation</h3>
        <p className="text-muted-foreground">Please answer the following questions about today.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>What year is it?</Label>
            <Input type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>What month is it?</Label>
            <Select onValueChange={setMonth} value={month}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>What is today's date?</Label>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Enter the day of the month"
            value={dateNumber}
            onChange={(e) => setDateNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>What day of the week is it?</Label>
          <Select onValueChange={setDay} value={day}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>What season is it?</Label>
          <Select onValueChange={setSeason} value={season}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasonOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Which part of the day is it?</Label>
          <Select onValueChange={setTimeOfDay} value={timeOfDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select part of the day" />
            </SelectTrigger>
            <SelectContent>
              {timeOfDayOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={!isComplete}>
        Submit
      </Button>
    </div>
  );
}
