export type Modality = "emdr" | "cbt" | "dbt" | "grief" | "adolescent";

export interface EMDRResource {
  name: string;
  type: "safe_place" | "calm_place" | "nurturing" | "protector";
  description: string;
}

export interface Cognition {
  negative: string;
  positive: string;
  voc: number;
}

export interface Anchor {
  title: string;
  body: string;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  badge: string;
  modality: Modality;
  condition: string;
  phase: string;
  lastSession: string;
  therapistNote: string;
  sessionSummary: string;
  journalPrompt: string;
  anchors: Anchor[];
  checkIns: number[];
  // EMDR-specific
  sudsBaseline?: number;
  currentPhase?: string;
  resources?: EMDRResource[];
  cognition?: Cognition;
  // CBT-specific
  coreBeliefs?: string[];
  // DBT-specific
  dbtSkillsFocus?: string[];
  // Grief-specific
  griefStage?: string;
}

export const patients: Patient[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    initials: "SC",
    age: 34,
    badge: "EMDR · Trauma Processing",
    modality: "emdr",
    condition: "Motor vehicle accident 8 months ago — active PTSD symptoms",
    phase: "Phase 4-5 · Active Processing",
    lastSession: "Tuesday",
    therapistNote:
      "Sarah, the work you did today on the highway memory took real courage — I could see how hard you were working through it, and I want you to know that every bit of that effort matters. Remember the container is always there if anything feels too heavy between now and our next session. When things get difficult, come back to the garden — the jasmine, the warmth, your grandmother's presence. You are not walking through this alone.",
    sessionSummary:
      "Continued Phase 4 processing of target memory: highway driving scene at moment of impact. Client demonstrated strong dual awareness throughout. SUD reduced from 7 to 4 by session end. Installation of 'I am safe now' cognition initiated. Container visualization reinforced for between-session stabilization.",
    journalPrompt:
      "This week, notice any moments where anxiety around driving — or being near traffic — shows up for you. What do you notice in your body? What helped you stay present? There's no need to push through anything. Just notice, and write what feels okay to write.",
    anchors: [
      {
        title: "Safe Place — Grandmother's Garden",
        body: "Close your eyes and find yourself in the garden. Notice the jasmine — its smell, the warmth of the sun on your shoulders. Your grandmother is nearby. This place is yours. Nothing that happened on the highway exists here.",
      },
      {
        title: "Container Visualization",
        body: "Picture your container — strong, sealed, yours to design. Anything that feels too heavy between sessions can go inside. You choose when to open it, only with me present. It holds what you're not ready to carry today.",
      },
      {
        title: "Positive Cognition — I Am Safe Now",
        body: "\"I am safe now.\" When the highway memory pulls, bring this back. It's not a denial of what happened — it's the truth of where you are right now. You survived. You are here. You are safe.",
      },
      {
        title: "Grounding Anchor",
        body: "Both feet on the floor. Feel the weight of your body in the chair. Look around — name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. You are here. You are present. You are okay.",
      },
    ],
    checkIns: [3, 4, 3, 5, 4, 6, 5],
    sudsBaseline: 7,
    currentPhase: "Phase 4 — Desensitization of highway driving memory",
    resources: [
      {
        name: "Grandmother's Garden",
        type: "safe_place",
        description:
          "A sunlit garden filled with jasmine where her late grandmother tends flowers. Warm, still, deeply safe.",
      },
      {
        name: "Beach at Sunrise",
        type: "calm_place",
        description:
          "An empty beach just after sunrise — cool sand, soft waves, nobody else around. Spacious and calming.",
      },
      {
        name: "Her Late Grandmother",
        type: "nurturing",
        description:
          "Warm, steady, unconditionally loving. Always knew what to say. Smells like the garden and fresh bread.",
      },
      {
        name: "Strong Self",
        type: "protector",
        description:
          "A version of Sarah who has already healed — confident, clear-eyed, unafraid. She knows the way through.",
      },
    ],
    cognition: {
      negative: "I am not safe",
      positive: "I am safe now",
      voc: 4,
    },
  },

  {
    id: "james",
    name: "James Okafor",
    initials: "JO",
    age: 41,
    badge: "CBT · Performance Anxiety",
    modality: "cbt",
    condition: "Performance anxiety, imposter syndrome, work-related stress",
    phase: "Active Treatment · Week 8",
    lastSession: "Wednesday",
    therapistNote:
      "James, what happened in our session today — that moment when you caught yourself mid-thought and said 'wait, that's the old belief talking' — that was not small. That was the work actually taking hold. I'm assigning thought records this week not as homework, but as evidence-collection. You're building a case for a truer version of yourself. Keep going.",
    sessionSummary:
      "Breakthrough session: client spontaneously identified core belief 'I am only as good as my last result' operating in real time during a work narrative. Cognitive restructuring applied with strong client engagement. Introduced thought records for between-session practice. Evidence log for 'I am capable regardless of outcome' begun.",
    journalPrompt:
      "Watch for where the belief 'my worth equals my output' shows up this week — in a meeting, in how you feel after a presentation, in what you tell yourself at the end of a day. You don't have to argue with it. Just notice it. Write down the situation, the thought, and what you actually know to be true.",
    anchors: [
      {
        title: "Core Insight — My Worth Is Not My Output",
        body: "\"My worth as a person is not determined by my last result, my productivity, or whether anyone sees through me.\" This is the belief we're replacing. Read it when the old one gets loud.",
      },
      {
        title: "Thought Challenge Questions",
        body: "1. What's the evidence FOR this thought? 2. What's the evidence AGAINST it? 3. What would I tell a colleague who believed this about themselves? 4. What's a more balanced way to see this?",
      },
      {
        title: "5-4-3-2-1 Grounding",
        body: "When anxiety spikes before a meeting or presentation: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Slow your nervous system before your mind takes over.",
      },
      {
        title: "Progress Anchor",
        body: "Eight weeks ago you couldn't name the belief. This week you caught it mid-sentence. That's not nothing. When the imposter voice gets loud, remember: you are already changing.",
      },
    ],
    checkIns: [5, 4, 6, 5, 7, 6, 6],
    coreBeliefs: [
      "I am only as good as my last result",
      "If I fail, I am a failure",
      "Others will see through me",
    ],
  },

  {
    id: "elena",
    name: "Elena Vasquez",
    initials: "EV",
    age: 27,
    badge: "DBT · Distress Tolerance",
    modality: "dbt",
    condition:
      "Borderline personality features, emotional dysregulation, self-harm history (in remission)",
    phase: "DBT Skills Training · Module 3 — Distress Tolerance",
    lastSession: "Thursday",
    therapistNote:
      "Elena, I hear you — this was a genuinely hard week, and I don't want to minimize that. What I also want you to see is what you did: you felt the surge, you recognized it, and you reached for TIPP instead of the old behavior. That is real. That is you using your skills when it counted, not just in session. Please keep filling in your diary card — it's not paperwork, it's your record of fighting for yourself.",
    sessionSummary:
      "Client reported difficult interpersonal incident mid-week with significant emotional escalation. Notably used TIPP (intense exercise, cold water) to manage distress — first reported use in a high-stakes situation. Explored emotions before and after skill use. Validated experience; reinforced skill effectiveness. Continued Module 3 with introduction of Radical Acceptance concepts.",
    journalPrompt:
      "Think back to a moment this week when you felt an emotional surge coming. What did you notice first — in your body, your thoughts, the situation? Which skill did you reach for, or wish you had? Write about what happened, and what it felt like on the other side of it.",
    anchors: [
      {
        title: "TIPP Reminder",
        body: "Temperature (cold water on face or hold ice), Intense exercise (run, jump, anything that raises heart rate), Paced breathing (breathe out longer than in), Progressive relaxation. Use these when emotion mind is running the show and you need a fast reset.",
      },
      {
        title: "Radical Acceptance Phrase",
        body: "\"It is what it is — and fighting reality only makes the pain worse.\" Radical Acceptance doesn't mean you approve. It means you stop adding suffering to pain. Say it out loud if you need to.",
      },
      {
        title: "Safe Person to Call",
        body: "Before you act on an urge — call or text one person from your safety network. Reaching out is a skill, not a weakness. The act of connecting changes your emotional state.",
      },
      {
        title: "Wise Mind Check-In",
        body: "Close your eyes. Breathe. Ask: what does Wise Mind — not Emotion Mind, not Reasonable Mind — say about this situation right now? Wait for the answer. It's quieter than the other voices, but it's there.",
      },
    ],
    checkIns: [4, 6, 3, 7, 4, 5, 6],
    dbtSkillsFocus: ["TIPP", "ACCEPTS", "IMPROVE", "Radical Acceptance"],
  },

  {
    id: "michael",
    name: "Michael Torres",
    initials: "MT",
    age: 58,
    badge: "Grief Counseling · Complicated Loss",
    modality: "grief",
    condition: "Complicated grief — loss of spouse (Linda) 14 months ago",
    phase: "Grief Counseling · Month 6",
    lastSession: "Monday",
    therapistNote:
      "Michael, the anniversary week was always going to be hard — and you carried it with so much grace. Linda's presence in your life is not something you have to leave behind. We're not trying to move you past her. We're trying to help you carry her forward — into the parts of life that are still yours to live. Both things can be true: the grief and the living. You are allowed to feel both.",
    sessionSummary:
      "Session focused on the 14-month anniversary of Linda's passing. Client shared significant memories and expressed deep longing alongside some guilt about moments of forward movement. Oscillating grief model introduced and normalized — loss orientation and restoration orientation both validated. Client identified one small moment from the week that felt like 'living' — watching a Cardinals game. Encouraged to honor that, alongside honoring Linda.",
    journalPrompt:
      "Write about a memory of Linda — one you want to hold onto, something small or large that captures who she was. Then write about one small thing from this week that felt, even briefly, like living. You don't have to reconcile those two things. Just let them both exist on the page.",
    anchors: [
      {
        title: "Memory Preservation — Linda",
        body: "\"Her laugh was the kind that made you want to be funnier.\" Choose one phrase, one image, one thing that is only hers. Keep it somewhere close. Grief is love with nowhere to go — this is somewhere.",
      },
      {
        title: "Permission to Feel Both",
        body: "You are allowed to miss her and to laugh at a Cardinals game. You are allowed to cry in the morning and enjoy dinner in the evening. These are not contradictions. This is what carrying love looks like.",
      },
      {
        title: "Restoration Focus",
        body: "What is one thing — small, ordinary, forward-facing — that belongs to your life now? Not a replacement. Just something that is yours to engage with. Write it down. Do it when you can.",
      },
      {
        title: "Gratitude Anchor",
        body: "Not gratitude that she's gone — never that. But gratitude for the years. For what she gave you that is still inside you. For the person she knew you to be. That person is still here.",
      },
    ],
    checkIns: [4, 3, 5, 4, 4, 5, 4],
    griefStage: "Oscillating · Loss and Restoration",
  },

  {
    id: "aisha",
    name: "Aisha Johnson",
    initials: "AJ",
    age: 29,
    badge: "EMDR · Attachment Trauma",
    modality: "emdr",
    condition: "Childhood emotional neglect, attachment trauma",
    phase: "Phase 3 · Resource Installation + Stabilization",
    lastSession: "Friday",
    therapistNote:
      "Aisha, look at how far you've come. You have a full resource team now — a safe place, a calm place, a nurturing figure who sees you, a protector who has your back. This phase isn't a waiting room before the real work. This IS the real work. We're building the foundation that makes everything else possible. You are doing exactly what you need to do, and I'm proud of you.",
    sessionSummary:
      "Completed Phase 3 resource installation. All four EMDR resources now fully installed with bilateral stimulation: safe place (sunlit reading room), calm place (forest path), nurturing figure (idealized grandmother), protector figure (wise elder). Client demonstrated strong access to all resources. Positive cognition 'I am worthy of care' introduced and linked to resource state. VOC rated at 3 — expected at this stage. Stabilization phase to continue for 2–3 more sessions before processing begins.",
    journalPrompt:
      "This week, notice if your protector figure or nurturing figure shows up for you — even in small ways. Maybe it's a moment when you spoke up for yourself, or when you let yourself receive something good. Write about one moment when you felt, even briefly, like you mattered.",
    anchors: [
      {
        title: "Resource Team",
        body: "You have four: your sunlit room with books (safe place), your forest path (calm place), your nurturing grandmother figure (always there, always warm), and your wise elder protector (strong and steady). They are all installed. They are yours to call on.",
      },
      {
        title: "Safe Place — Sunlit Reading Room",
        body: "Warm afternoon light through tall windows. Books everywhere. Quiet. A chair that fits you perfectly. No one needs anything from you here. You exist here simply because you are worthy of existing.",
      },
      {
        title: "Positive Cognition",
        body: "\"I am worthy of care.\" You may not fully believe this yet — that's okay. Say it anyway. Feel where it lands in your body. We're planting something that will grow.",
      },
      {
        title: "Bilateral Stimulation Reminder for Resourcing",
        body: "Tap your knees alternately (left, right, left, right) while holding your safe place or your resource team in mind. You can do this anywhere, anytime you need to reinforce the resource. It works.",
      },
    ],
    checkIns: [5, 6, 5, 6, 6, 7, 6],
    sudsBaseline: 5,
    currentPhase: "Phase 3 — Resource Installation and Stabilization",
    resources: [
      {
        name: "Sunlit Reading Room",
        type: "safe_place",
        description:
          "A warm room filled with books and afternoon light. Quiet, safe, entirely hers. No demands exist here.",
      },
      {
        name: "Forest Path",
        type: "calm_place",
        description:
          "A dappled path through tall trees. Cool air, soft sounds, infinite gentleness. She can breathe here.",
      },
      {
        name: "Idealized Grandmother Figure",
        type: "nurturing",
        description:
          "Soft, warm, unconditionally present. She sees Aisha fully and loves what she sees. Always has time. Always kind.",
      },
      {
        name: "Wise Elder",
        type: "protector",
        description:
          "Ancient, calm, powerful in the way of deep roots. Knows the way through. Has always believed in her.",
      },
    ],
    cognition: {
      negative: "I don't matter",
      positive: "I am worthy of care",
      voc: 3,
    },
  },

  {
    id: "tyler",
    name: "Tyler Park",
    initials: "TP",
    age: 17,
    badge: "CBT · Social Anxiety · Adolescent",
    modality: "adolescent",
    condition: "Social anxiety, school performance pressure, perfectionism",
    phase: "CBT · Active Treatment · Month 3",
    lastSession: "Thursday",
    therapistNote:
      "Tyler — dude, the thing you did at lunch on Wednesday? That was genuinely brave. You sat down with people you didn't know. You stayed. You didn't bail. I know it felt awkward and I know your brain was probably narrating the whole thing, but here's the thing: you did it anyway. That's the whole game. Keep adding to the ladder. You're climbing.",
    sessionSummary:
      "Client reported voluntary initiation of social contact in school cafeteria — sat with unfamiliar peers for approximately 12 minutes before departing. Significant milestone given avoidance history. Anxiety rated 6/10 before, 4/10 during, 3/10 after — demonstrating habituation pattern. Reinforced evidence against 'everyone is watching' belief. Updated courage ladder: next step identified as speaking first in a small group. Perfectionism and academic pressure briefly addressed; will expand next session.",
    journalPrompt:
      "Think of a social situation from this week — one you're proud of navigating, or one you wish had gone differently. What happened? What was your brain telling you? What would you tell a friend in that same situation? (And yes, you can write about lunch on Wednesday if you want.)",
    anchors: [
      {
        title: "Courage Ladder — What You've Done",
        body: "Said hi to someone in the hall ✓ · Answered a question in class when you knew the answer ✓ · Stayed at lunch with people you didn't know for 12 minutes ✓. You are further up this ladder than you think.",
      },
      {
        title: "Thought Challenge",
        body: "\"Most people aren't watching as closely as I think.\" When the spotlight feeling hits, remember: everyone else is too busy worrying about themselves to be studying you. You're not the main character in their story — and that's actually good news.",
      },
      {
        title: "Body Check-In",
        body: "Before a hard social moment: notice where you feel the anxiety in your body. Chest tight? Stomach? Shoulders? Name it, then take three slow breaths — in for 4, hold for 4, out for 6. You're telling your nervous system it's not an emergency.",
      },
      {
        title: "One Brave Thing",
        body: "This week: speak first in a group — even if it's just 'hey' or a question. You don't have to be funny or impressive. Just first. Add it to the ladder when you do.",
      },
    ],
    checkIns: [5, 4, 6, 7, 5, 6, 7],
  },
];

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}
