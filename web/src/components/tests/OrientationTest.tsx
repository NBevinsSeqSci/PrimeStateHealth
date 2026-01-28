"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export type OrientationResult = {
  score: number;
  maxScore: number;
  answers: {
    year: string;
    month: string;
    date: string;
    day: string;
    season: string;
    timeOfDay: string;
  };
};

export default function OrientationTest({
  onComplete,
}: {
  onComplete: (result: OrientationResult) => void;
}) {
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

  const dayOptions = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    onComplete({
      score,
      maxScore: 6,
      answers: { year, month, date: dateNumber, day, season, timeOfDay },
    });
  };

  const isComplete = year && month && dateNumber && day && season && timeOfDay;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">Orientation</h3>
        <p className="text-sm text-slate-600">
          Please answer the following questions about today.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="year">What year is it?</Label>
            <Input
              id="year"
              type="number"
              inputMode="numeric"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="YYYY"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">What month is it?</Label>
            <Select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select month</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">What is today's date?</Label>
          <Input
            id="date"
            type="number"
            inputMode="numeric"
            placeholder="Enter the day of the month"
            value={dateNumber}
            onChange={(e) => setDateNumber(e.target.value)}
            min="1"
            max="31"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="day">What day of the week is it?</Label>
          <Select
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select day</option>
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">What season is it?</Label>
          <Select
            id="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="">Select season</option>
            {seasonOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeOfDay">Which part of the day is it?</Label>
          <Select
            id="timeOfDay"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            <option value="">Select part of the day</option>
            {timeOfDayOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isComplete}
        className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
}
