'use client'
import React, { useEffect, useState } from 'react';
import { Lock, Clock, Unlock } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ArtsayComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to 2 months from when component mounts
    const targetDate = dayjs().add(2, 'month');

    function updateTimer() {
      const now = dayjs();
      const diff = targetDate.diff(now);

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const duration = dayjs.duration(diff);
      setTimeLeft({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    }

    const timerId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timerId);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 w-24">
      <span className="text-3xl font-heading text-primary transition-all duration-300">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-sm font-text text-secondary uppercase mt-1">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <Clock className="h-16 w-16 text-primary mx-auto mb-6 animate-bounce" />
        
        <h1 className="text-5xl font-heading text-primary mb-4">
          ARTSAY COMING SOON
        </h1>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <p className="text-xl font-heading text-primary mb-2">
            Discover Unique Artworks from Global Artists
          </p>
          <p className="text-lg font-text text-secondary">
            Join Our Creative Community
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-lg font-heading text-primary">Platform Launch Countdown</span>
            <Unlock className="h-5 w-5 text-primary" />
          </div>
          <p className="text-secondary font-text mb-4">
            Our platform will be launching in {timeLeft.days} days. Get ready to explore and connect with amazing artists worldwide!
          </p>
          <p className="text-primary font-heading">Join the waitlist now!</p>
        </div>

        <h2 className="text-2xl font-heading text-primary mt-8">
          Artsay
        </h2>
        
        <div className="inline-block bg-primary text-white px-6 py-2 rounded-full font-heading">
          {timeLeft.days} days until launch
        </div>
      </div>
    </div>
  );
};