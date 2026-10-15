import { Note, Task, StudyMaterial, User, Quiz, FlashcardDeck } from '@/types';

export const DEFAULT_USER: User = {
  id: 'user_default',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  major: 'Computer Science & AI',
  targetWeeklyHours: 25,
  streakDays: 7,
};

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    userId: 'user_default',
    title: 'Operating Systems: Concurrency & Semaphores',
    content: `# Operating Systems: Concurrency & Semaphores\n\n## 1. The Critical Section Problem\nWhen multiple threads execute concurrently and share resources (memory, file handles), race conditions occur without mutual exclusion.\n\n### Requirements for Solution:\n1. **Mutual Exclusion**: If process Pi is executing in its critical section, no other processes can be.\n2. **Progress**: If no process is executing, selection of the next process cannot be postponed indefinitely.\n3. **Bounded Waiting**: There must be a limit on times other processes enter their critical sections before a requesting process is granted access.\n\n## 2. Counting Semaphores vs Mutexes\n- **Mutex**: Binary lock (0 or 1), strict ownership by locking thread.\n- **Semaphore**: Integer counter initialized to resource count. \n  - \`wait() / P()\`: decrements counter, blocks if negative.\n  - \`signal() / V()\`: increments counter, unblocks waiting process.\n\n## Key Takeaway\nAvoid Deadlocks by ensuring: Mutual exclusion, Hold and Wait, No preemption, and Circular wait conditions do not simultaneously occur.`,
    category: 'Computer Science',
    tags: ['OS', 'Concurrency', 'Semaphores', 'Threads'],
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'note_2',
    userId: 'user_default',
    title: 'Graph Algorithms: Dijkstra vs Bellman-Ford',
    content: `# Graph Algorithms: Shortest Paths\n\n## Dijkstra's Algorithm\n- **Type**: Greedy algorithm using Min-Heap / Priority Queue.\n- **Constraint**: Cannot handle negative edge weights.\n- **Time Complexity**: O((V + E) log V) with adjacency list and binary heap.\n- **Use Case**: Network routing (OSPF), GPS navigation.\n\n## Bellman-Ford Algorithm\n- **Type**: Dynamic programming approach relaxing all edges V-1 times.\n- **Key Feature**: Can detect negative weight cycles.\n- **Time Complexity**: O(V * E).\n\n## A* Search Heuristic\nCombines Dijkstra's actual cost g(n) with heuristic estimate h(n): f(n) = g(n) + h(n). Admissible heuristics never overestimate cost.`,
    category: 'Computer Science',
    tags: ['Algorithms', 'Graphs', 'Dijkstra', 'Complexity'],
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note_3',
    userId: 'user_default',
    title: 'Cellular Respiration & Krebs Cycle Breakdown',
    content: `# Cellular Respiration & ATP Yield\n\n## Phase 1: Glycolysis (Cytoplasm)\n- Glucose (6C) is cleaved into 2 Pyruvate (3C molecules).\n- Net Yield: 2 ATP (substrate-level phosphorylation) + 2 NADH.\n- Anaerobic process; doesn't require O2.\n\n## Phase 2: Pyruvate Oxidation & Citric Acid (Krebs) Cycle (Mitochondrial Matrix)\n- Acetyl-CoA combines with Oxaloacetate (4C) to form Citrate (6C).\n- 2 turns of the cycle yield: 2 ATP/GTP, 6 NADH, 2 FADH2, and 4 CO2 released.\n\n## Phase 3: Oxidative Phosphorylation & ETC (Inner Mitochondrial Membrane)\n- Electrons donated by NADH and FADH2 power proton pumps creating electrochemical gradient.\n- ATP Synthase uses chemiosmosis to produce approx 26-28 ATP.\n- Total theoretical yield: ~30-32 ATP per glucose molecule.`,
    category: 'Biology',
    tags: ['Metabolism', 'Biochemistry', 'Mitochondria', 'ATP'],
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'note_4',
    userId: 'user_default',
    title: 'Linear Algebra: Eigenvalues and SVD Matrix Decomposition',
    content: `# Linear Algebra: Spectral Theory & SVD\n\n## 1. Eigenvalues and Eigenvectors\nFor an n x n square matrix A, a non-zero vector v satisfies:\n$$A v = \\lambda v$$\nCharacteristic equation: $\\det(A - \\lambda I) = 0$.\n\n## 2. Diagonalization\nIf A has n linearly independent eigenvectors, $A = P D P^{-1}$, where D is diagonal containing eigenvalues.\n\n## 3. Singular Value Decomposition (SVD)\nWorks on ANY m x n matrix M:\n$$M = U \\Sigma V^T$$\n- U: $m \\times m$ orthogonal matrix (left singular vectors)\n- $\\Sigma$: $m \\times n$ diagonal matrix with non-negative singular values $\\sigma_i$\n- $V$: $n \\times n$ orthogonal matrix (right singular vectors)\n\nApplications: Principal Component Analysis (PCA), image compression, recommender systems.`,
    category: 'Mathematics',
    tags: ['Math', 'Linear Algebra', 'SVD', 'Eigenvectors', 'ML'],
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    userId: 'user_default',
    title: 'Complete OS Lab 3: Multi-threaded Producer-Consumer',
    description: 'Implement circular buffer queue with POSIX semaphores and mutex locks. Test against race condition edge cases.',
    category: 'Computer Science',
    priority: 'high',
    status: 'in-progress',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0] + 'T23:59', // Tomorrow
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task_2',
    userId: 'user_default',
    title: 'Review Chapter 7 & 8: Graph Flow & Shortest Path',
    description: 'Solve 5 practice problems on Bellman-Ford and residual flow networks before the quiz.',
    category: 'Computer Science',
    priority: 'high',
    status: 'todo',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + 'T18:00', // 3 days
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task_3',
    userId: 'user_default',
    title: 'Submit Biology Research Paper Draft',
    description: 'Finalize sections on mitochondrial electron transport chain inhibitors and submit via canvas portal.',
    category: 'Biology',
    priority: 'medium',
    status: 'todo',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] + 'T17:00', // 5 days
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task_4',
    userId: 'user_default',
    title: 'Linear Algebra Problem Set 5 (Eigenvalues & SVD)',
    description: 'Work through problems 1-12. Verify decomposition using Python NumPy notebook.',
    category: 'Mathematics',
    priority: 'medium',
    status: 'completed',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0] + 'T23:59',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task_5',
    userId: 'user_default',
    title: 'Prepare Flashcards for Midterm Exam',
    description: 'Use the AI Flashcard generator to extract 20 cards from OS and Graph theory notes.',
    category: 'Study Prep',
    priority: 'low',
    status: 'todo',
    deadline: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0] + 'T20:00',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_1',
    userId: 'user_default',
    name: 'CS401_Distributed_Systems_Core_Principles.pdf',
    originalName: 'CS401_Distributed_Systems_Core_Principles.pdf',
    fileSize: 14250000, // 14.2 MB
    fileSizeFormatted: '14.2 MB',
    mimeType: 'application/pdf',
    uploadDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['Distributed Systems', 'CAP Theorem', 'Consensus', 'Raft'],
    isAnalyzed: true,
    pageCount: 38,
    textSnippet: 'Distributed Systems: A distributed system is a collection of autonomous computing entities that communicate over a network to achieve a common goal. Key challenges include latency, partial failure, clock synchronization, and data consistency under partitions (CAP theorem).',
    fullText: `Distributed Systems: Core Architecture and Consensus Protocols

Chapter 1: Introduction and System Models
A distributed system consists of multiple software components situated on networked computers, coordinating their actions through message passing.
Key characteristics:
1. Concurrency of components
2. Lack of a global clock
3. Independent failure of components

Chapter 2: The CAP Theorem
Formulated by Eric Brewer, the CAP theorem states that a distributed data store can simultaneously provide at most two out of the following three guarantees:
- Consistency (C): Every read receives the most recent write or an error.
- Availability (A): Every non-failing node returns a response for every request without guarantee that it contains the most recent write.
- Partition Tolerance (P): The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.
Since physical networks are inherently prone to network partitions, distributed systems in the real world must choose between Consistency (CP) and Availability (AP).

Chapter 3: Consensus Protocols (Paxos and Raft)
Consensus is the problem of reaching agreement on a single data value among distributed processes.
Raft consensus breaks consensus into three clear subproblems:
1. Leader Election: When a leader fails, a new leader is elected by majority vote via randomized election timers.
2. Log Replication: The leader accepts log entries from clients and forces the followers' logs to replicate its own.
3. Safety: If any server has applied a particular log entry to its state machine, no other server will ever apply a different log entry for the same log index.

Chapter 4: Clock Synchronization and Vector Clocks
Lamport timestamps define a partial causal order ("happened-before" relation $\to$). Vector clocks extend Lamport timestamps by maintaining a vector of counters across all nodes, enabling exact detection of concurrent events and conflict resolution in dynamo-style storage systems.`,
  },
  {
    id: 'mat_2',
    userId: 'user_default',
    name: 'BIO204_Cell_Metabolism_and_Bioenergetics.pdf',
    originalName: 'BIO204_Cell_Metabolism_and_Bioenergetics.pdf',
    fileSize: 8900000, // 8.9 MB
    fileSizeFormatted: '8.9 MB',
    mimeType: 'application/pdf',
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Biology', 'Metabolism', 'Enzymes', 'Photosynthesis'],
    isAnalyzed: true,
    pageCount: 24,
    textSnippet: 'Cellular bioenergetics describes how chemical energy flows through living systems. Enzymes act as biological catalysts by lowering activation energy without altering the free energy change (delta G). ATP acts as the universal energy currency.',
    fullText: `Cellular Bioenergetics and Metabolic Pathways

Section 1: Thermodynamics in Biological Systems
Living organisms are open thermodynamic systems that maintain internal order by increasing the entropy of their surroundings.
Gibbs Free Energy equation:
Delta G = Delta H - T * Delta S
- Exergonic reactions (negative Delta G) proceed spontaneously and release usable free energy.
- Endergonic reactions (positive Delta G) require net energy input, typically coupled with ATP hydrolysis:
ATP + H2O -> ADP + Pi (Delta G = -30.5 kJ/mol).

Section 2: Enzyme Kinetics and Regulation
Enzymes accelerate biochemical reactions by stabilizing the transition state.
- Michaelis-Menten Kinetics: V0 = (Vmax * [S]) / (Km + [S])
- Km represents the substrate concentration at half-maximal velocity, inversely reflecting enzyme affinity.
- Competitive inhibition increases Km without changing Vmax.
- Non-competitive allosteric inhibition reduces Vmax without altering Km.

Section 3: Glycolysis and the Citric Acid Cycle
1. Glycolysis: Hexokinase and Phosphofructokinase-1 (PFK-1) serve as key regulatory checkpoints. Produces 2 net ATP and 2 NADH per glucose.
2. The Pyruvate Dehydrogenase Complex links glycolysis to the Krebs cycle inside the mitochondrial matrix.
3. Oxidative Phosphorylation: Complexes I, III, and IV pump protons into the intermembrane space, generating a proton-motive force driven across the F0-F1 ATP synthase complex.`,
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Distributed Systems & CAP Theorem Check',
    sourceType: 'material',
    sourceTitle: 'CS401_Distributed_Systems_Core_Principles.pdf',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    bestScore: 100,
    questions: [
      {
        id: 'q1',
        question: 'According to the CAP Theorem, why can a distributed system not guarantee both Consistency and Availability in real-world networks?',
        options: [
          'Because CPU cycles are insufficient to compute checksums',
          'Because network partitions (P) are unavoidable in physical networks, forcing a choice between C and A',
          'Because disks will inevitably corrupt data',
          'Because clocks cannot run backwards'
        ],
        correctAnswerIndex: 1,
        explanation: 'In physical networks, communication links can drop or delay packets (partitions). During a partition, nodes must either reject requests to preserve consistency or accept them and sacrifice consistency.'
      },
      {
        id: 'q2',
        question: 'In the Raft consensus protocol, what mechanism prevents split votes during leader election?',
        options: [
          'Manual operator intervention',
          'Randomized election timeouts',
          'Strict alphabetical server naming',
          'Round-robin node assignment'
        ],
        correctAnswerIndex: 1,
        explanation: 'Raft uses randomized election timeouts (e.g., 150-300ms) so that one candidate server will usually timeout first and win the majority vote before others start elections.'
      },
      {
        id: 'q3',
        question: 'What advantage do Vector Clocks provide over scalar Lamport Timestamps?',
        options: [
          'They execute in constant memory independent of cluster size',
          'They can differentiate between causally related events and truly concurrent events',
          'They eliminate the need for consensus algorithms',
          'They synchronize hardware clocks to UTC'
        ],
        correctAnswerIndex: 1,
        explanation: 'Lamport timestamps only define a partial order and cannot detect concurrency; Vector clocks maintain per-node counters, allowing systems to detect conflicts and concurrent events.'
      }
    ]
  }
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck_1',
    title: 'Operating Systems & Concurrency Deck',
    sourceType: 'note',
    sourceTitle: 'Operating Systems: Concurrency & Semaphores',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    cards: [
      {
        id: 'c1',
        term: 'Mutual Exclusion',
        definition: 'A concurrency condition ensuring that no more than one thread or process enters its critical section to access a shared resource at any given moment.',
        category: 'Operating Systems',
        mastered: true
      },
      {
        id: 'c2',
        term: 'Counting Semaphore',
        definition: 'A synchronization variable initialized to an integer representing resource availability, supporting atomic wait() / P() and signal() / V() operations.',
        category: 'Operating Systems',
        mastered: true
      },
      {
        id: 'c3',
        term: 'Deadlock',
        definition: 'A state where every process in a set is waiting for an event or resource that only another process in the same set can cause or release.',
        category: 'Operating Systems',
        mastered: false
      },
      {
        id: 'c4',
        term: 'Race Condition',
        definition: 'An anomalous flaw where the output or state depends on the uncontrollable timing or interleaving of concurrent execution threads.',
        category: 'Operating Systems',
        mastered: false
      }
    ]
  }
];

// Helper functions for LocalStorage management
const KEYS = {
  USER: 'ai_study_hub_user',
  NOTES: 'ai_study_hub_notes',
  TASKS: 'ai_study_hub_tasks',
  MATERIALS: 'ai_study_hub_materials',
  QUIZZES: 'ai_study_hub_quizzes',
  FLASHCARDS: 'ai_study_hub_flashcards',
  API_KEY: 'ai_study_hub_api_key',
  SETTINGS: 'ai_study_hub_settings',
};

export const Storage = {
  getUser: (): User => {
    if (typeof window === 'undefined') return DEFAULT_USER;
    const stored = localStorage.getItem(KEYS.USER);
    return stored ? JSON.parse(stored) : DEFAULT_USER;
  },
  setUser: (user: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getNotes: (): Note[] => {
    if (typeof window === 'undefined') return INITIAL_NOTES;
    const stored = localStorage.getItem(KEYS.NOTES);
    if (!stored) {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(stored);
  },
  setNotes: (notes: Note[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },

  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    const stored = localStorage.getItem(KEYS.TASKS);
    if (!stored) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(stored);
  },
  setTasks: (tasks: Task[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getMaterials: (): StudyMaterial[] => {
    if (typeof window === 'undefined') return INITIAL_MATERIALS;
    const stored = localStorage.getItem(KEYS.MATERIALS);
    if (!stored) {
      localStorage.setItem(KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    return JSON.parse(stored);
  },
  setMaterials: (materials: StudyMaterial[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(materials));
  },

  getQuizzes: (): Quiz[] => {
    if (typeof window === 'undefined') return INITIAL_QUIZZES;
    const stored = localStorage.getItem(KEYS.QUIZZES);
    if (!stored) {
      localStorage.setItem(KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
      return INITIAL_QUIZZES;
    }
    return JSON.parse(stored);
  },
  setQuizzes: (quizzes: Quiz[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  getFlashcards: (): FlashcardDeck[] => {
    if (typeof window === 'undefined') return INITIAL_FLASHCARD_DECKS;
    const stored = localStorage.getItem(KEYS.FLASHCARDS);
    if (!stored) {
      localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(INITIAL_FLASHCARD_DECKS));
      return INITIAL_FLASHCARD_DECKS;
    }
    return JSON.parse(stored);
  },
  setFlashcards: (decks: FlashcardDeck[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(decks));
  },

  getApiKey: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(KEYS.API_KEY) || '';
  },
  setApiKey: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.API_KEY, key);
  },

  // Reset to initial demo state
  resetToDemo: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
    localStorage.setItem(KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(INITIAL_FLASHCARD_DECKS));
  }
};
