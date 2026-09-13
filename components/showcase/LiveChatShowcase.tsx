"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "./icons";

/* ============================================================
   The staff inbox, mid-conversation.

   Rebuilt from the Genera app's shared chat components
   (conversation list, thread, typing indicator, composer), shown
   from the daycare side: everyone on the team replies from the
   right, each run signed with who sent it, and the driver joins
   the owner's thread on the day they drive.

   Plays once when scrolled into view; reduced-motion users get
   the finished conversation straight away.
   ============================================================ */

type Msg = {
  side: "owner" | "daycare";
  name: string;
  role?: "Driver";
  text: string;
  at: string;
};

const EARLIER: Msg[] = [
  { side: "owner", name: "Amanda", text: "Heads up, Milo's on a new food. I'll send a bag in with him tomorrow.", at: "17:48" },
  { side: "daycare", name: "Jess", text: "Thanks! I've added it to his feeding notes.", at: "17:52" },
];

const TODAY: Msg[] = [
  { side: "owner", name: "Amanda", text: "Morning! Work's run over. Is Milo OK to stay a bit later today?", at: "08:04" },
  { side: "daycare", name: "Jess", text: "Of course. We'll move him onto the 5:30 drop-off round.", at: "08:06" },
  { side: "daycare", name: "Sam", role: "Driver", text: "That's my round. I'll message when I'm ten minutes away.", at: "08:07" },
  { side: "owner", name: "Amanda", text: "You're all stars, thank you!", at: "08:09" },
  { side: "daycare", name: "Jess", text: "He's had a big play with Bailey this morning, so expect a sleepy boy tonight.", at: "08:11" },
];

const OTHER_THREADS = [
  { name: "Sam T.", initials: "ST", tag: "Driver", preview: "Round 1 loaded, heading off now", time: "07:52" },
  { name: "Carole F.", initials: "CF", preview: "Could Bailey's groom move to Thursday?", time: "07:40", unread: true },
  { name: "Jess M.", initials: "JM", tag: "Team", preview: "Can anyone cover my Friday late?", time: "Yesterday" },
  { name: "Tom H.", initials: "TH", preview: "You: Rex's 7 nights are confirmed", time: "Tue" },
  { name: "Ruth E.", initials: "RE", preview: "Nala's booster is booked for the 30th", time: "8 Sep" },
];

export default function LiveChatShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(0, () => {
        setShown(TODAY.length);
        setSeen(true);
      });
      return () => timers.forEach(clearTimeout);
    }

    const play = () => {
      at(300, () => setShown(1));
      at(1400, () => setShown(2));
      at(2300, () => setShown(3));
      at(3300, () => setTyping(true));
      at(5000, () => {
        setTyping(false);
        setShown(4);
      });
      // Jess types the last reply into the composer, then sends it.
      const reply = TODAY[TODAY.length - 1].text;
      let t = 6000;
      for (let i = 1; i <= reply.length; i++) {
        const text = reply.slice(0, i);
        at(t, () => setDraft(text));
        t += 30;
      }
      at(t + 400, () => {
        setDraft("");
        setShown(TODAY.length);
      });
      at(t + 1900, () => setSeen(true));
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const latest = shown > 0 ? TODAY[shown - 1] : EARLIER[EARLIER.length - 1];

  return (
    <figure ref={rootRef} className="relative mx-auto w-full max-w-[680px]">
      <figcaption className="sr-only">
        The Genera staff inbox. Amanda asks if Milo can stay late, Jess from the
        daycare replies, Sam the driver joins the same thread to confirm the
        drop-off, and Amanda sees the final reply.
      </figcaption>

      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[4%] top-[10%] -bottom-[6%] rounded-[40%_60%_55%_45%/48%_52%_48%_52%] bg-teal-soft"
      />

      <div
        aria-hidden
        className="relative flex h-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-[0_24px_60px_rgba(0,62,69,0.16)] sm:h-[540px]"
      >
        {/* Conversation list */}
        <div className="hidden w-[256px] shrink-0 flex-col border-r border-gray-100 sm:flex">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <span className="flex items-center gap-2 text-[17px] font-semibold text-forest">
              <ChatBubbleLeftRightIcon className="h-[22px] w-[22px] text-[#d98e00]" />
              Messages
            </span>
            <span className="flex items-center gap-1.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl text-gray-500 ring-1 ring-gray-200">
                <PencilSquareIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex rounded-xl bg-[#ffa800] p-0.5 text-forest">
                <span className="grid h-7 w-7 place-items-center">
                  <MegaphoneIcon className="h-[17px] w-[17px]" />
                </span>
                <span className="grid h-7 w-7 place-items-center">
                  <ClockIcon className="h-[17px] w-[17px]" />
                </span>
              </span>
            </span>
          </div>

          <div className="px-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <div className="rounded-xl bg-gray-100 py-1.5 pl-8 text-[13px] text-gray-400">Search</div>
            </div>
            <div className="mt-2.5 grid grid-cols-2 rounded-xl bg-gray-100 p-0.5 text-center text-[12px] font-semibold">
              <span className="rounded-[10px] bg-white py-1 text-forest shadow-sm">Inbox</span>
              <span className="py-1 text-gray-500">Archived</span>
            </div>
          </div>

          <ul className="mt-2 flex-1 overflow-hidden">
            <ThreadRow
              name="Amanda R."
              initials="AR"
              preview={latest.text}
              time={shown > 0 ? latest.at : "Yesterday"}
              selected
            />
            {OTHER_THREADS.map((t) => (
              <ThreadRow key={t.name} {...t} />
            ))}
          </ul>
        </div>

        {/* Thread */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white/95 px-2 py-2.5 sm:px-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gray-600 sm:hidden">
              <ArrowLeftIcon className="h-6 w-6" />
            </span>
            <Initials text="AR" className="h-9 w-9 text-[11px]" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-forest">Amanda R.</span>
              <span className="block truncate text-xs text-gray-500">Milo · Daycare Mon, Wed, Thu</span>
            </span>
            <span className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full text-gray-500">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 py-3 sm:px-5">
            <DayDivider label="Yesterday" />
            <Bubbles msgs={EARLIER} />
            {shown > 0 && (
              <>
                <DayDivider label="Today" />
                <Bubbles
                  msgs={TODAY.slice(0, shown)}
                  seenIndex={seen ? TODAY.length - 1 : undefined}
                  animate
                />
              </>
            )}
          </div>

          {typing && (
            <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-500">
              <span className="inline-flex items-end gap-0.5">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot [animation-delay:150ms]" />
                <span className="chat-typing-dot [animation-delay:300ms]" />
              </span>
              Amanda is typing
            </div>
          )}

          <div className="flex items-end gap-2 border-t border-gray-100 bg-white px-2.5 py-2">
            <div
              className={`min-h-[44px] flex-1 rounded-3xl bg-gray-100 px-4 py-2.5 text-[15px] leading-6 transition-shadow ${
                draft ? "ring-2 ring-[#ffa800]/60" : ""
              }`}
            >
              {draft ? (
                <span className="text-forest">
                  {draft}
                  <span className="ml-px inline-block h-[1.1em] w-px translate-y-[2px] animate-pulse bg-forest" />
                </span>
              ) : (
                <span className="text-gray-400">Write a message…</span>
              )}
            </div>
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-white shadow-sm transition-transform ${
                draft ? "scale-105" : ""
              }`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Bubbles({ msgs, seenIndex, animate }: { msgs: Msg[]; seenIndex?: number; animate?: boolean }) {
  return (
    <ul className="space-y-2">
      {msgs.map((m, i) => {
        const mine = m.side === "daycare";
        const prev = msgs[i - 1];
        const next = msgs[i + 1];
        // The daycare side is a shared voice, so every run there is signed.
        const showName = mine && (!prev || prev.name !== m.name);
        const endsRun = !next || next.name !== m.name;
        return (
          <li
            key={`${m.at}-${m.name}`}
            className={`flex ${mine ? "justify-end" : "justify-start"} ${
              animate ? "motion-safe:animate-[chatIn_0.35s_ease-out_both]" : ""
            }`}
          >
            <div className={`flex max-w-[85%] flex-col sm:max-w-[78%] ${mine ? "items-end" : "items-start"}`}>
              {showName && (
                <span className="mr-1 mb-0.5 flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  {m.name}
                  {m.role && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-px text-[10px] font-semibold text-amber-800">
                      {m.role}
                    </span>
                  )}
                </span>
              )}
              <span
                className={
                  mine
                    ? "rounded-2xl rounded-br-md bg-forest px-3.5 py-2 text-[15px] leading-6 text-white"
                    : "rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2 text-[15px] leading-6 text-forest"
                }
              >
                {m.text}
              </span>
              {endsRun && (
                <span className="mt-0.5 px-1 text-[10px] text-gray-400">
                  {m.at}
                  {seenIndex === i && <span className="ml-1.5 font-medium text-[#cc8600]">· Seen</span>}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ThreadRow({
  name,
  initials,
  preview,
  time,
  tag,
  unread,
  selected,
}: {
  name: string;
  initials: string;
  preview: string;
  time: string;
  tag?: string;
  unread?: boolean;
  selected?: boolean;
}) {
  return (
    <li className={`flex gap-3 py-2.5 pr-3 pl-4 ${selected ? "bg-[#ffa800]/10" : ""}`}>
      <span className="relative shrink-0">
        <Initials text={initials} className="h-11 w-11 text-[13px]" />
        {unread && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />
        )}
      </span>
      <span className="min-w-0 flex-1 self-center">
        <span className="flex items-center gap-1.5">
          <span className={`truncate text-[15px] text-forest ${unread ? "font-semibold" : "font-medium"}`}>
            {name}
          </span>
          {tag && (
            <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-px text-[10px] font-semibold text-amber-800">
              {tag}
            </span>
          )}
          <span
            className={`ml-auto shrink-0 text-[11px] ${
              unread ? "font-semibold text-[#b37400]" : "text-gray-400"
            }`}
          >
            {time}
          </span>
        </span>
        <span className="block truncate text-[13px] text-gray-500">{preview}</span>
      </span>
    </li>
  );
}

function Initials({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 font-semibold text-gray-600 ring-1 ring-gray-300 ${className}`}
    >
      {text}
    </span>
  );
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">{label}</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );
}
