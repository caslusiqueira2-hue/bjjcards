import * as THREE from 'three';
import { AthleteJoints } from './BJJ3DAthleteBuilder';
import { CombatPosition } from '../../../types/combat';

export interface JointTransform {
  position?: [number, number, number];
  rotation: [number, number, number]; // Euler angles (x, y, z) in radians
}

export type AthletePoseData = Partial<Record<keyof AthleteJoints, JointTransform>>;

export interface DuelScenePose {
  topAthlete: AthletePoseData;
  bottomAthlete: AthletePoseData;
  cameraTarget?: [number, number, number];
  cameraPosition?: [number, number, number];
}

export const BJJ_POSES: Record<CombatPosition, DuelScenePose> = {
  // =========================================================================
  // 1. MONTADA (MOUNT) - The classic premier BJJ dominant position
  // Top athlete straddling defender's torso with heavy hips and knees pinching
  // =========================================================================
  MOUNT: {
    cameraPosition: [0, 1.8, 2.8],
    cameraTarget: [0, 0.4, 0],
    bottomAthlete: {
      root: { position: [0, 0.12, 0], rotation: [-Math.PI / 2, 0, 0] },
      head: { rotation: [0.2, 0, 0] },
      // Defensive crossed arms protecting neck & collar
      leftShoulder: { rotation: [0.4, 0.5, 0.2] },
      leftUpperArm: { rotation: [-0.6, 0.3, 0] },
      leftForearm: { rotation: [-1.4, 0, 0.4] },
      rightShoulder: { rotation: [0.4, -0.5, -0.2] },
      rightUpperArm: { rotation: [-0.6, -0.3, 0] },
      rightForearm: { rotation: [-1.4, 0, -0.4] },
      // Flat legs on mat
      leftHip: { rotation: [0, 0.1, -0.15] },
      leftThigh: { rotation: [-0.1, 0, 0] },
      leftShin: { rotation: [0.15, 0, 0] },
      rightHip: { rotation: [0, -0.1, 0.15] },
      rightThigh: { rotation: [-0.1, 0, 0] },
      rightShin: { rotation: [0.15, 0, 0] }
    },
    topAthlete: {
      // Straddling directly over bottom athlete's torso
      root: { position: [0, 0.36, -0.05], rotation: [0.12, 0, 0] },
      chest: { rotation: [0.15, 0, 0] },
      head: { rotation: [-0.15, 0, 0] },
      // Knees flaring around defender's ribs, heavy low base
      leftHip: { rotation: [0.3, 0.3, -0.65] },
      leftThigh: { rotation: [0.65, 0.2, 0] },
      leftShin: { rotation: [1.65, 0, 0.2] },
      leftFoot: { rotation: [-0.4, 0, 0] },
      rightHip: { rotation: [0.3, -0.3, 0.65] },
      rightThigh: { rotation: [0.65, -0.2, 0] },
      rightShin: { rotation: [1.65, 0, -0.2] },
      rightFoot: { rotation: [-0.4, 0, 0] },
      // Arms postured driving base on the mat / gripping collars
      leftShoulder: { rotation: [-0.5, 0.2, 0.3] },
      leftUpperArm: { rotation: [-0.4, 0, 0] },
      leftForearm: { rotation: [-0.5, 0, 0] },
      rightShoulder: { rotation: [-0.5, -0.2, -0.3] },
      rightUpperArm: { rotation: [-0.4, 0, 0] },
      rightForearm: { rotation: [-0.5, 0, 0] }
    }
  },

  // =========================================================================
  // 2. GUARDA FECHADA (CLOSED GUARD)
  // Bottom athlete on back with legs locked around kneeling passer
  // =========================================================================
  CLOSED_GUARD: {
    cameraPosition: [1.8, 1.6, 2.2],
    cameraTarget: [0, 0.4, 0],
    bottomAthlete: {
      root: { position: [0, 0.14, 0.35], rotation: [-Math.PI / 2 + 0.15, 0, 0] },
      head: { rotation: [0.35, 0, 0] },
      // Guard legs clamped around passer
      leftHip: { rotation: [0.2, 0.3, -0.45] },
      leftThigh: { rotation: [-0.85, 0.2, 0] },
      leftShin: { rotation: [1.5, 0, -0.3] },
      rightHip: { rotation: [0.2, -0.3, 0.45] },
      rightThigh: { rotation: [-0.85, -0.2, 0] },
      rightShin: { rotation: [1.5, 0, 0.3] },
      // Arms controlling sleeves / collars
      leftShoulder: { rotation: [-0.7, 0.3, 0.2] },
      leftUpperArm: { rotation: [-0.3, 0, 0] },
      leftForearm: { rotation: [-0.8, 0, 0] },
      rightShoulder: { rotation: [-0.7, -0.3, -0.2] },
      rightUpperArm: { rotation: [-0.3, 0, 0] },
      rightForearm: { rotation: [-0.8, 0, 0] }
    },
    topAthlete: {
      // Kneeling inside closed guard with upright posture
      root: { position: [0, 0.32, 0.05], rotation: [0, Math.PI, 0] },
      chest: { rotation: [-0.2, 0, 0] },
      head: { rotation: [0.15, 0, 0] },
      leftHip: { rotation: [0.1, 0.15, -0.3] },
      leftThigh: { rotation: [0.8, 0, 0] },
      leftShin: { rotation: [1.55, 0, 0] },
      rightHip: { rotation: [0.1, -0.15, 0.3] },
      rightThigh: { rotation: [0.8, 0, 0] },
      rightShin: { rotation: [1.55, 0, 0] },
      // Hands framing on bottom player's hips/belt to break posture
      leftShoulder: { rotation: [-0.7, 0.2, 0.1] },
      leftUpperArm: { rotation: [-0.2, 0, 0] },
      leftForearm: { rotation: [-0.4, 0, 0] },
      rightShoulder: { rotation: [-0.7, -0.2, -0.1] },
      rightUpperArm: { rotation: [-0.2, 0, 0] },
      rightForearm: { rotation: [-0.4, 0, 0] }
    }
  },

  // =========================================================================
  // 3. GUARDA ABERTA / DE LA RIVA (OPEN GUARD)
  // Bottom athlete with De La Riva hook behind knee and foot on hip
  // =========================================================================
  OPEN_GUARD: {
    cameraPosition: [1.6, 1.5, 2.4],
    cameraTarget: [0, 0.45, 0],
    bottomAthlete: {
      root: { position: [0, 0.14, 0.4], rotation: [-Math.PI / 2 + 0.1, 0, 0] },
      head: { rotation: [0.4, 0, 0] },
      // DLR hook around right knee of passer
      leftHip: { rotation: [0.4, 0.5, -0.3] },
      leftThigh: { rotation: [-0.9, 0.3, 0] },
      leftShin: { rotation: [1.7, 0, 0.4] },
      // Right foot on hip
      rightHip: { rotation: [0.2, -0.2, 0.2] },
      rightThigh: { rotation: [-0.7, -0.1, 0] },
      rightShin: { rotation: [1.2, 0, -0.1] },
      leftShoulder: { rotation: [-0.9, 0.4, 0.1] },
      leftForearm: { rotation: [-0.6, 0, 0] },
      rightShoulder: { rotation: [-0.8, -0.3, -0.1] },
      rightForearm: { rotation: [-0.7, 0, 0] }
    },
    topAthlete: {
      // Passer in low combat stance trying to strip the hook
      root: { position: [0, 0.58, -0.15], rotation: [0.25, Math.PI, 0] },
      chest: { rotation: [0.2, 0, 0] },
      head: { rotation: [-0.2, 0, 0] },
      leftHip: { rotation: [0, 0.2, -0.3] },
      leftThigh: { rotation: [0.55, 0, 0] },
      leftShin: { rotation: [0.85, 0, 0] },
      rightHip: { rotation: [0, -0.2, 0.3] },
      rightThigh: { rotation: [0.65, 0, 0] },
      rightShin: { rotation: [0.95, 0, 0] },
      leftShoulder: { rotation: [-0.8, 0.2, 0] },
      leftForearm: { rotation: [-0.7, 0, 0] },
      rightShoulder: { rotation: [-0.8, -0.2, 0] },
      rightForearm: { rotation: [-0.7, 0, 0] }
    }
  },

  // =========================================================================
  // 4. MEIA GUARDA (HALF GUARD)
  // Leg entanglement with underhook deep fight
  // =========================================================================
  HALF_GUARD: {
    cameraPosition: [1.9, 1.4, 2.0],
    cameraTarget: [0, 0.35, 0],
    bottomAthlete: {
      root: { position: [-0.05, 0.14, 0.15], rotation: [-Math.PI / 2 + 0.1, 0, 0.4] },
      head: { rotation: [0.2, 0.2, 0] },
      // Legs trapping one leg of passer
      leftHip: { rotation: [0.3, 0.2, -0.2] },
      leftThigh: { rotation: [-0.7, 0, 0] },
      leftShin: { rotation: [1.4, 0, 0] },
      rightHip: { rotation: [0.1, -0.1, 0.1] },
      rightThigh: { rotation: [-0.65, 0, 0] },
      rightShin: { rotation: [1.45, 0, 0.2] },
      // Deep underhook under passer's armpit
      rightShoulder: { rotation: [-1.2, -0.4, -0.3] },
      rightUpperArm: { rotation: [-0.2, 0, 0] },
      rightForearm: { rotation: [-0.8, 0, 0] },
      leftShoulder: { rotation: [-0.5, 0.2, 0.2] },
      leftForearm: { rotation: [-0.7, 0, 0] }
    },
    topAthlete: {
      // Passer heavy on top with crossface and flattened base
      root: { position: [0.08, 0.32, 0.05], rotation: [0.2, Math.PI - 0.2, 0] },
      chest: { rotation: [0.1, 0, 0] },
      leftHip: { rotation: [0.1, 0.2, -0.3] },
      leftThigh: { rotation: [0.75, 0, 0] },
      leftShin: { rotation: [1.5, 0, 0] },
      rightHip: { rotation: [0.1, -0.3, 0.4] },
      rightThigh: { rotation: [0.4, 0, 0] },
      rightShin: { rotation: [0.8, 0, 0] },
      // Crossface arm wrapping bottom head
      leftShoulder: { rotation: [-1.1, 0.3, 0.4] },
      leftForearm: { rotation: [-1.1, 0, 0] },
      rightShoulder: { rotation: [-0.7, -0.4, -0.2] },
      rightForearm: { rotation: [-0.5, 0, 0] }
    }
  },

  // =========================================================================
  // 5. 100KG / CONTROLE LATERAL (SIDE CONTROL)
  // Perpendicular chest-to-chest heavy pressure with head & arm control
  // =========================================================================
  SIDE_CONTROL: {
    cameraPosition: [2.1, 1.5, 1.8],
    cameraTarget: [0, 0.35, 0],
    bottomAthlete: {
      root: { position: [0, 0.12, 0], rotation: [-Math.PI / 2, 0, 0] },
      head: { rotation: [0.1, 0.2, 0] },
      // Defensive frames with forearms
      leftShoulder: { rotation: [0.3, 0.4, 0.2] },
      leftForearm: { rotation: [-1.5, 0, 0.3] },
      rightShoulder: { rotation: [-0.6, -0.3, -0.2] },
      rightForearm: { rotation: [-1.3, 0, -0.2] },
      leftHip: { rotation: [0, 0.1, -0.1] },
      leftThigh: { rotation: [-0.2, 0, 0] },
      leftShin: { rotation: [0.4, 0, 0] },
      rightHip: { rotation: [0, -0.1, 0.1] },
      rightThigh: { rotation: [-0.2, 0, 0] },
      rightShin: { rotation: [0.4, 0, 0] }
    },
    topAthlete: {
      // Perpendicular over defender's chest
      root: { position: [0.35, 0.30, 0.05], rotation: [0.15, Math.PI / 2, 0] },
      chest: { rotation: [0.2, 0, 0] },
      // Crossfacing around head and underhooking armpit
      leftShoulder: { rotation: [-1.2, 0.4, 0.2] },
      leftForearm: { rotation: [-1.2, 0, 0.3] },
      rightShoulder: { rotation: [-0.9, -0.3, -0.2] },
      rightForearm: { rotation: [-0.8, 0, 0] },
      // Wide splayed knees for unshakeable base
      leftHip: { rotation: [0.2, 0.4, -0.5] },
      leftThigh: { rotation: [0.8, 0, 0] },
      leftShin: { rotation: [1.6, 0, 0] },
      rightHip: { rotation: [0.2, -0.4, 0.5] },
      rightThigh: { rotation: [0.8, 0, 0] },
      rightShin: { rotation: [1.6, 0, 0] }
    }
  },

  // =========================================================================
  // 6. COSTAS COM GANCHOS (BACK MOUNT)
  // Two hooks in, chest glued to back, tight seatbelt control
  // =========================================================================
  BACK_MOUNT: {
    cameraPosition: [1.8, 1.6, 2.3],
    cameraTarget: [0, 0.45, 0],
    bottomAthlete: {
      root: { position: [0, 0.35, 0.1], rotation: [0.3, 0, 0] },
      head: { rotation: [0.1, 0, 0] },
      // Hands defending the choking arm
      leftShoulder: { rotation: [-0.8, 0.3, 0.2] },
      leftForearm: { rotation: [-1.4, 0, 0.2] },
      rightShoulder: { rotation: [-0.8, -0.3, -0.2] },
      rightForearm: { rotation: [-1.4, 0, -0.2] },
      leftHip: { rotation: [0, 0.2, -0.2] },
      leftThigh: { rotation: [0.3, 0, 0] },
      leftShin: { rotation: [0.8, 0, 0] },
      rightHip: { rotation: [0, -0.2, 0.2] },
      rightThigh: { rotation: [0.3, 0, 0] },
      rightShin: { rotation: [0.8, 0, 0] }
    },
    topAthlete: {
      // Glued directly behind defender with hooks sunk in
      root: { position: [0, 0.38, -0.18], rotation: [0.35, 0, 0] },
      chest: { rotation: [0.15, 0, 0] },
      head: { rotation: [-0.1, 0.1, 0] },
      // Hooks inside defender's thighs
      leftHip: { rotation: [0.2, 0.4, -0.4] },
      leftThigh: { rotation: [0.55, 0.2, 0] },
      leftShin: { rotation: [1.4, 0, -0.2] },
      rightHip: { rotation: [0.2, -0.4, 0.4] },
      rightThigh: { rotation: [0.55, -0.2, 0] },
      rightShin: { rotation: [1.4, 0, 0.2] },
      // Seatbelt grip: over the shoulder and under armpit
      leftShoulder: { rotation: [-1.4, 0.4, 0.3] },
      leftForearm: { rotation: [-1.3, 0, 0.4] },
      rightShoulder: { rotation: [-0.9, -0.4, -0.3] },
      rightForearm: { rotation: [-1.2, 0, -0.4] }
    }
  },

  // =========================================================================
  // 7. LUTA EM PÉ (STANDING)
  // Low athletic wrestling stance, collar and sleeve kumi-kata grip battle
  // =========================================================================
  STANDING: {
    cameraPosition: [0, 1.4, 3.2],
    cameraTarget: [0, 0.75, 0],
    bottomAthlete: {
      // Left grappler in stance
      root: { position: [-0.55, 0.78, 0], rotation: [0.2, Math.PI / 2, 0] },
      chest: { rotation: [0.15, 0, 0] },
      head: { rotation: [-0.15, 0, 0] },
      leftHip: { rotation: [0, 0.2, -0.2] },
      leftThigh: { rotation: [-0.35, 0, 0] },
      leftShin: { rotation: [0.55, 0, 0] },
      rightHip: { rotation: [0, -0.2, 0.2] },
      rightThigh: { rotation: [0.25, 0, 0] },
      rightShin: { rotation: [0.45, 0, 0] },
      // Gripping collar & sleeve
      leftShoulder: { rotation: [-0.85, 0.3, 0.1] },
      leftForearm: { rotation: [-0.4, 0, 0] },
      rightShoulder: { rotation: [-0.75, -0.3, -0.1] },
      rightForearm: { rotation: [-0.6, 0, 0] }
    },
    topAthlete: {
      // Right grappler in matching stance
      root: { position: [0.55, 0.78, 0], rotation: [0.2, -Math.PI / 2, 0] },
      chest: { rotation: [0.15, 0, 0] },
      head: { rotation: [-0.15, 0, 0] },
      leftHip: { rotation: [0, 0.2, -0.2] },
      leftThigh: { rotation: [0.25, 0, 0] },
      leftShin: { rotation: [0.45, 0, 0] },
      rightHip: { rotation: [0, -0.2, 0.2] },
      rightThigh: { rotation: [-0.35, 0, 0] },
      rightShin: { rotation: [0.55, 0, 0] },
      leftShoulder: { rotation: [-0.75, 0.3, 0.1] },
      leftForearm: { rotation: [-0.6, 0, 0] },
      rightShoulder: { rotation: [-0.85, -0.3, -0.1] },
      rightForearm: { rotation: [-0.4, 0, 0] }
    }
  },

  // =========================================================================
  // 8. CLINCH
  // Collar tie and underhook pummeling chest-to-chest
  // =========================================================================
  CLINCH: {
    cameraPosition: [0, 1.5, 2.7],
    cameraTarget: [0, 0.75, 0],
    bottomAthlete: {
      root: { position: [-0.20, 0.82, 0], rotation: [0.15, Math.PI / 2, 0] },
      chest: { rotation: [0.1, 0, 0] },
      leftShoulder: { rotation: [-1.2, 0.4, 0.2] }, // collar tie around neck
      leftForearm: { rotation: [-0.9, 0, 0.3] },
      rightShoulder: { rotation: [-0.8, -0.3, -0.2] }, // underhook
      rightForearm: { rotation: [-0.5, 0, 0] },
      leftThigh: { rotation: [-0.25, 0, 0] },
      leftShin: { rotation: [0.45, 0, 0] },
      rightThigh: { rotation: [0.2, 0, 0] },
      rightShin: { rotation: [0.4, 0, 0] }
    },
    topAthlete: {
      root: { position: [0.20, 0.82, 0], rotation: [0.15, -Math.PI / 2, 0] },
      chest: { rotation: [0.1, 0, 0] },
      leftShoulder: { rotation: [-0.8, 0.3, 0.2] }, // underhook
      leftForearm: { rotation: [-0.5, 0, 0] },
      rightShoulder: { rotation: [-1.2, -0.4, -0.2] }, // collar tie
      rightForearm: { rotation: [-0.9, 0, -0.3] },
      leftThigh: { rotation: [0.2, 0, 0] },
      leftShin: { rotation: [0.4, 0, 0] },
      rightThigh: { rotation: [-0.25, 0, 0] },
      rightShin: { rotation: [0.45, 0, 0] }
    }
  },

  // =========================================================================
  // 9. TARTARUGA (TURTLE)
  // Defensive 4-point compact shell with top attacker sprawled over
  // =========================================================================
  TURTLE: {
    cameraPosition: [1.8, 1.5, 2.2],
    cameraTarget: [0, 0.3, 0],
    bottomAthlete: {
      // Compact defensive shell on all fours
      root: { position: [0, 0.24, 0], rotation: [0, -Math.PI / 2, 0] },
      chest: { rotation: [0.4, 0, 0] },
      head: { rotation: [-0.4, 0, 0] },
      // Knees tucked into elbows
      leftHip: { rotation: [0, 0.1, -0.2] },
      leftThigh: { rotation: [1.2, 0, 0] },
      leftShin: { rotation: [1.8, 0, 0] },
      rightHip: { rotation: [0, -0.1, 0.2] },
      rightThigh: { rotation: [1.2, 0, 0] },
      rightShin: { rotation: [1.8, 0, 0] },
      // Elbows locked to knees protecting neck
      leftShoulder: { rotation: [-0.5, 0.2, 0.2] },
      leftForearm: { rotation: [-1.6, 0, 0.2] },
      rightShoulder: { rotation: [-0.5, -0.2, -0.2] },
      rightForearm: { rotation: [-1.6, 0, -0.2] }
    },
    topAthlete: {
      // Sprawled over the turtle controlling hips
      root: { position: [0.15, 0.45, 0], rotation: [0.35, -Math.PI / 2, 0] },
      chest: { rotation: [0.2, 0, 0] },
      leftShoulder: { rotation: [-1.1, 0.3, 0] },
      leftForearm: { rotation: [-1.0, 0, 0] },
      rightShoulder: { rotation: [-1.1, -0.3, 0] },
      rightForearm: { rotation: [-1.0, 0, 0] },
      leftThigh: { rotation: [-0.2, 0.2, 0] },
      leftShin: { rotation: [0.6, 0, 0] },
      rightThigh: { rotation: [-0.2, -0.2, 0] },
      rightShin: { rotation: [0.6, 0, 0] }
    }
  }
};

/**
 * Applies a pose data structure to an AthleteJoints object
 */
export function applyPoseToJoints(joints: AthleteJoints, pose: AthletePoseData, alpha: number = 1.0) {
  for (const [jointKey, transform] of Object.entries(pose)) {
    const joint = (joints as any)[jointKey] as THREE.Group | undefined;
    if (!joint) continue;

    if (transform.position) {
      const [tx, ty, tz] = transform.position;
      if (alpha >= 1.0) {
        joint.position.set(tx, ty, tz);
      } else {
        joint.position.lerp(new THREE.Vector3(tx, ty, tz), alpha);
      }
    }

    if (transform.rotation) {
      const [rx, ry, rz] = transform.rotation;
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz));
      if (alpha >= 1.0) {
        joint.quaternion.copy(targetQuat);
      } else {
        joint.quaternion.slerp(targetQuat, alpha);
      }
    }
  }
}
