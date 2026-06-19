import { TechfestEvent, CyberRobot, InteractiveItem, QuantumNode, Sponsor, SpaceObject } from './types';

export const EVENTS_DATA: TechfestEvent[] = [
  {
    id: 'meshmesh',
    title: 'Mesh-Madness 3.0',
    category: 'Robotics',
    description: 'Design and program autonomous swarms of quadrupeds and bio-drones to navigate dynamic obstacle hazards.',
    prizePool: 'INR 15,00,000',
    date: 'Dec 14, 2050',
    overview: 'In Mesh-Madness 3.0, teams present autonomous quadruped and micro-UAV swarms working in tandem. The arena simulates a post-collapse rescue scenario with shifting obstacles, fire walls, and communications blackouts.',
    rules: [
      'Swarms must contain between 4 and 8 independent agents.',
      'No direct RF control; must run entirely on edge-computed AI.',
      'Maximum weight per agent is limited to 4.5kg.'
    ],
    timeline: [
      'Phase 1: Simulation Sandbox validation (October 2050)',
      'Phase 2: Live Arena qualifiers (December 14, 2050)',
      'Phase 3: Grand Finale run (December 16, 2050)'
    ]
  },
  {
    id: 'xenobiot',
    title: 'XenoBot Assembly',
    category: 'Robotics',
    description: 'Assemble and program cellular microrobots using wetware computation, executing nano-scale surgical trials.',
    prizePool: 'INR 18,00,000',
    date: 'Dec 15, 2050',
    overview: 'Competitors design micro-robotic structures manipulated by electromagnetic fields and chemical triggers to target simulated cellular pathogens in our bio-lab chambers.',
    rules: [
      'Xenobots must utilize the standard tissue templates provided.',
      'Wetware computation must be completed under 3 minutes per cell operation.',
      'Safe contamination disposal protocols must be strictly followed.'
    ],
    timeline: [
      'Oct 2050: Synthetic Tissue Kit Dispatch',
      'Nov 2050: Bio-logical design submission',
      'Dec 15, 2050: Direct microscopic arena trials'
    ]
  },
  {
    id: 'ai_synapse',
    title: 'Synapse Net hackathon',
    category: 'AI & ML',
    description: 'A 48-hour neural simulation challenge to achieve direct visual-to-concept synthesis on dryware cognitive nodes.',
    prizePool: 'INR 25,00,000',
    date: 'Dec 14-16, 2050',
    overview: 'Develop and train a cognitive intelligence layer using direct neural impulse feeds. Synapse Net tests the limits of real-time conceptual translation from raw brainwave frequencies.',
    rules: [
      'Only raw brainwave dataset streams provided by Techfest may be utilized.',
      'Maximum cognitive cycles per epoch is limited to 1.2 PetaFLOPs.',
      'Must maintain an accuracy above 98.4% without cognitive leakage.'
    ],
    timeline: [
      'H-00: Dataset decryption and framework access',
      'H-24: Midpoint validation and cognitive stress test',
      'H-48: Final conceptual translation audit'
    ]
  },
  {
    id: 'deep_mind',
    title: 'DeepMind Hackathon',
    category: 'AI & ML',
    description: 'Compile self-improving deep RL agents that adapt to unpredictable multi-agent combat in quantum simulations.',
    prizePool: 'INR 20,00,000',
    date: 'Dec 15, 2050',
    overview: 'Build adversarial RL models capable of rapid multi-agent coordination inside a non-Euclidean quantum space simulator.',
    rules: [
      'Agents must adapt dynamically to changes in spatial dimensions (3D to 4D).',
      'No pre-trained baseline weights exceeding 5B parameters.',
      'Zero communication delay is assumed; models must sync implicitly.'
    ],
    timeline: [
      'Nov 15, 2050: Sandbox release',
      'Dec 15, 2050: Real-time arena execution runs'
    ]
  },
  {
    id: 'quantum_crypto',
    title: 'Quantum Crypt 2050',
    category: 'Coding',
    description: 'Overcome quantum cryptography nodes using quantum-annealing-resistant algorithms and post-quantum keys.',
    prizePool: 'INR 12,00,000',
    date: 'Dec 15, 2050',
    overview: 'This is the ultimate test of cybersecurity in 2050. Hackers have 24 hours to crack standard post-quantum infrastructure nodes using a simulated 2000-qubit processor.',
    rules: [
      'Execution restricted to the provided Techfest Quantum Terminal instance.',
      'Only algorithms listed in the 2050 NIST recommendation matrix are permitted.',
      'Exploits must be registered via smart contract loggers.'
    ],
    timeline: [
      'Morning: Initial node breach and network scanning',
      'Afternoon: Quantum network bypass and key extraction',
      'Night: Direct core system overtake'
    ]
  },
  {
    id: 'fusion_hyper',
    title: 'Hyperion Aerospace',
    category: 'Aerospace',
    description: 'Design a magnetic containment shield for safe solar plasma collection inside scoop-craft orbiting Venus.',
    prizePool: 'INR 30,00,000',
    date: 'Dec 14, 2050',
    overview: 'Hyperion challenges the limits of aerospace design, pushing for reliable atmospheric solar harvesting scoops. Teams model thermodynamic and electromagnetic boundary dynamics.',
    rules: [
      'Design must operate safely at Venusian high-thermosphere temperatures (735K+).',
      'Total satellite weight must not exceed interplanetary thrust budget limits.',
      'Plasma storage must rely purely on superconducting electro-confinement.'
    ],
    timeline: [
      'Oct 2050: Structural engineering peer reviews',
      'Nov 2050: Virtual particle simulator trials',
      'Dec 14, 2050: Planetary scoop demonstration'
    ]
  },
  {
    id: 'space_colo_challenge',
    title: 'Martian Hab-Grid',
    category: 'Aerospace',
    description: 'Architect a self-sustaining underground biodome grid on Mars capable of hosting 50,000 human colonists.',
    prizePool: 'INR 22,00,000',
    date: 'Dec 16, 2050',
    overview: 'Apply environmental engineering, resource management algorithms, and fusion systems to construct a Mars underground settlement simulation.',
    rules: [
      'Must utilize modular geothermal or fusion power matrices.',
      'Must prove 100% recycling loops for water, nitrogen, and CO2.',
      'Must sustain unexpected meteor bombardment scenario simulations.'
    ],
    timeline: [
      'Dec 16, 2050: Dynamic simulation loading',
      'Dec 16, 2050: Automated disaster stress test evaluation'
    ]
  },
  {
    id: 'neuro_gaming',
    title: 'Neuro-Clash esports',
    category: 'Gaming',
    description: 'Enter the Neural VR grid. Compete using brain-computer interface (BCI) links in complete zero-latency virtual arena.',
    prizePool: 'INR 35,00,000',
    date: 'Dec 14-16, 2050',
    overview: 'Techfest presents the premier cerebral esports tournament. Gamers bypass visual controllers and play directly through synchronized brain motor imagery.',
    rules: [
      'Only custom medical-grade non-invasive BCI bands may be worn.',
      'Synthesized mental-imagery command speed capped at 600 BPM.',
      'Neural feedback is filtered to prevent physical discomfort.'
    ],
    timeline: [
      'Dec 14: Neural calibration rounds',
      'Dec 15: Single elimination grid clashes',
      'Dec 16: Grand esports arena championship'
    ]
  }
];

export const ROBOTS_DATA: CyberRobot[] = [
  {
    id: 'agi_bot',
    name: 'AGI Hub Sentinel',
    description: 'The central city cognitive coordinator, managing automated municipal systems and real-time public infrastructure.',
    category: 'Artificial General Intelligence',
    details: [
      'Utilizes a 500-qubit neuromorphic brain core.',
      'Performs 2.4 Exa-operations per microsecond under maximum load.',
      'Synchronizes municipal infrastructure including energy output, localized transport grids, and holographic public warnings.'
    ],
    status: 'ONLINE / OPTIMAL',
    type: 'District Coordinator Class',
    features: ['Cognitive Synthesis', 'Infrastructure Sync', 'Holographic Broadcast', 'Quantum Crypt Keys'],
    x: -250,
    y: 80,
    z: 150,
    hue: 190
  },
  {
    id: 'med_drone',
    name: 'MediSync Hexapod',
    description: 'Self-governing trauma responsive quadruped, equipped with active gene-stabilizing medicine dispensers.',
    category: 'AI Healthcare',
    details: [
      'Responds within 12 seconds to emergency bio-sensor alerts anywhere in the city sector.',
      'Performs direct automated microsurgery relying on active scanning lasers.'
    ],
    status: 'STANDBY / ACTIVE SHIELD',
    type: 'Emergency Medical Class',
    features: ['Cellular Diagnostic Scans', 'Gene-Stabilizer Inoculations', 'Sub-millimeter Surgical Claws'],
    x: 200,
    y: -50,
    z: 220,
    hue: 340
  },
  {
    id: 'auto_cab',
    name: 'Grid Transit Core',
    description: 'Localized floating transport drone, connected via central AI to bypass intersections without deceleration loops.',
    category: 'Autonomous Cities',
    details: [
      'Sustains perfect 420 km/h movement vectors safely in public sectors.',
      'Synchronized automatically using electromagnetic induction lines.'
    ],
    status: 'ROUTING EN-ROUTE',
    type: 'Logistics and Transit Core',
    features: ['Fusion Propelled Drift', 'Inter-Drone Collision Avoidance', 'Real-time Vector Routing'],
    x: -100,
    y: -120,
    z: 300,
    hue: 280
  },
  {
    id: 'space_drone',
    name: 'Hyperion Scout Drone',
    description: 'Atmospheric research drone dispatched for active exploration of deep-crater atmospheric vents.',
    category: 'AI Space Exploration',
    details: [
      'Engineered with reinforced solid giga-alloy armor.',
      'Performs scans of hyper-intense planetary temperatures and dense toxic gases.'
    ],
    status: 'PATROLLING STRATOSPHERE',
    type: 'Extreme Environment Scout',
    features: ['Carbon-Silicon Sensors', 'Ion-Drive Thrusters', 'Long-range Quantum Comms Link'],
    x: 300,
    y: 120,
    z: 100,
    hue: 45
  }
];

export const HOTSPOTS_DATA: InteractiveItem[] = [
  {
    id: 'humanoid_hand',
    name: 'Synaptic Hand-Flexor',
    description: 'Humanoid arm end-effector built with biomechanical carbon-muscle arrays. Achieves the exact precision of biological hands.',
    category: 'Humanoid Robotics',
    details: [
      'Giga-weave carbon-nanotube artificial muscles matching real human tissue flex.',
      '0.02 millisecond respond latency utilizing direct spinal-synapse bridge simulation.'
    ],
    specs: {
      'Tension Strength': '42,000 N/m',
      'Precise Accuracy': '±0.005mm',
      'Sensory Terminals': '4,500 piezoresistive nodes'
    },
    x: -180,
    y: 60,
    z: 50,
    hue: 150
  },
  {
    id: 'laser_scanner',
    name: 'Lidar Matrix Eye',
    description: 'High-frequency solid-state visual lidar scanning module, constructing a surrounding spatial map in microseconds.',
    category: 'Industrial Automation',
    details: [
      'Sweeps 8 million vector points per rotation using sub-atomic lasers.',
      'Detections bypass standard interference patterns from background neon light noise.'
    ],
    specs: {
      'Scanning Depth': '1,200 meters',
      'Beam Speed': '3 * 10^8 m/s',
      'Wave Matrix': '1550nm solid phase array'
    },
    x: 180,
    y: -80,
    z: 80,
    hue: 200
  },
  {
    id: 'exoskeleton_spine',
    name: 'Cyber-Spinal Harness',
    description: 'Active exoskeleton framework redistributing load stress directly away from vertebrae, enabling comfortable 500kg lifts.',
    category: 'Medical Robotics',
    details: [
      'Self-calibrating pressure plates monitoring spinal curve parameters.',
      'Ultra-dense graphene storage cell storing charge for 72 operational hours.'
    ],
    specs: {
      'Stress Reduction': '98.6%',
      'Weight Allowance': 'Up to 650 kilograms',
      'Energy Yield': '1.2 kW/h per walk cycle'
    },
    x: 0,
    y: 140,
    z: -30,
    hue: 10
  }
];

export const SPACE_OBJECTS_DATA: SpaceObject[] = [
  {
    id: 'mars_dome',
    name: 'Olympus Sector Dome',
    description: 'The sovereign metropolis habitat situated inside the deep shield of Martian Olympus Mons, housing over 250k residents.',
    category: 'Space Colonization',
    details: [
      'Double-shell diamond canopy maintaining stable 1.0 ATM pressure levels.',
      'Active magnetic shield generators deflecting cosmic radiation hazards.'
    ],
    orbitRadius: 320,
    orbitSpeed: 0.003,
    angle: 0.1,
    type: 'colony',
    x: 0,
    y: 0,
    z: 0,
    hue: 15
  },
  {
    id: 'space_station_sol',
    name: 'Apex Transit Hub',
    description: 'A massive rotating torus in Earth-Moon Lagrange point, functioning as the primary orbital docking station for space scoop ships.',
    category: 'Interplanetary Travel',
    details: [
      'Centripetal acceleration generating comfortable 0.9G gravity simulation loops.',
      'Docking ports accommodating 12 heavy magnetic interstellar engines simultaneously.'
    ],
    orbitRadius: 180,
    orbitSpeed: 0.008,
    angle: 2.2,
    type: 'station',
    x: 0,
    y: 0,
    z: 0,
    hue: 210
  },
  {
    id: 'fusion_pod',
    name: 'Helios Scoop-Craft 12',
    description: 'Continuous helium-3 stellar gathering scoop ship, traveling the Venusian high thermosphere boundaries.',
    category: 'Fusion Propulsion',
    details: [
      'Bypasses drag barriers relying on high-density superconducting magnetic shield tunnels.',
      'Helium-3 storage modules utilized for direct lunar fusion grid delivery.'
    ],
    orbitRadius: 240,
    orbitSpeed: 0.015,
    angle: 4.5,
    type: 'rocket',
    x: 0,
    y: 0,
    z: 0,
    hue: 110
  }
];

export const QUANTUM_NODES_DATA: QuantumNode[] = [
  {
    id: 'q_core_1',
    name: 'Shor-Symmetric Matrix Node',
    description: 'Fault-tolerant quantum processor, performing active entanglement swaps to guarantee unbreakable messaging.',
    details: [
      'Holds 15,000 physical qubits in state-preservation matrices.',
      'Decoupled entirely from environmental magnetic fields using active helium refrigeration.'
    ],
    x: -160,
    y: 80,
    z: -50,
    vx: 0.1,
    vy: -0.15,
    vz: 0.05,
    connections: ['q_core_2', 'q_core_4']
  },
  {
    id: 'q_core_2',
    name: 'Entangled Synapse Hub',
    description: 'The core interface routing global Brain-Computer links, handling 40 million concurrent conceptual audio networks.',
    details: [
      'Direct synaptic sensory translation relying on multi-phase neural antennas.',
      'Maintains synchronous brainwave state feedback without physical latency.'
    ],
    x: 180,
    y: 100,
    z: 100,
    vx: -0.15,
    vy: 0.1,
    vz: -0.1,
    connections: ['q_core_1', 'q_core_3']
  },
  {
    id: 'q_core_3',
    name: 'Silicon-Cell BioSynthesizer',
    description: 'Programmable bio-logical designer system modeling genomic mutations and generating target protein synthesizers.',
    details: [
      'Generates 14,000 target vaccine formulas per second under neural evaluation loops.',
      'Simulates biochemical lipid envelopes utilizing active quantum nodes.'
    ],
    x: 120,
    y: -120,
    z: -120,
    vx: 0.08,
    vy: -0.05,
    vz: 0.15,
    connections: ['q_core_2', 'q_core_4']
  },
  {
    id: 'q_core_4',
    name: 'Neural Quantum Nexus',
    description: 'Central neural mesh feedback layer executing organic intelligence emulation models across distributed networks.',
    details: [
      'Integrates biological wetware loops back into standard digital computing frames.',
      'Self-corrects system noise using deep organic predictive state nets.'
    ],
    x: -100,
    y: -140,
    z: 150,
    vx: -0.12,
    vy: 0.14,
    vz: -0.08,
    connections: ['q_core_1', 'q_core_3']
  }
];

export const SPONSORS_DATA: Sponsor[] = [
  { id: 'sp_1', name: 'NeuroLink Dynamic', tier: 'Title', role: 'Cognitive Computing Sponsor', angle: 0, distance: 160, speed: 0.005 },
  { id: 'sp_2', name: 'Aether Dynamics', tier: 'Platinum', role: 'Advanced Fusion Energy Sponsor', angle: 1.25, distance: 220, speed: -0.003 },
  { id: 'sp_3', name: 'Hyperion Spacecraft', tier: 'Platinum', role: 'Interplanetary logistics partner', angle: 2.5, distance: 280, speed: 0.002 },
  { id: 'sp_4', name: 'Shor Cryptography', tier: 'Gold', role: 'Quantum Security Systems Provider', angle: 3.75, distance: 190, speed: -0.004 },
  { id: 'sp_5', name: 'Xeno Biotech Labs', tier: 'Gold', role: 'Synthetic Medicine Sponsor', angle: 5.0, distance: 250, speed: 0.0035 },
  { id: 'sp_6', name: 'Vortex Quantum', tier: 'Strategic', role: 'Distributed Processing Infrastructure', angle: 0.6, distance: 310, speed: 0.0015 }
];
