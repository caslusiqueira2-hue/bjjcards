import * as THREE from 'three';
import { createGiTexture, createSkinMaterial } from './BJJ3DTextures';
import { Belt } from '../../../types/athlete';

export interface AthleteJoints {
  root: THREE.Group;
  pelvis: THREE.Group;
  spine: THREE.Group;
  chest: THREE.Group;
  head: THREE.Group;
  neck: THREE.Group;
  leftShoulder: THREE.Group;
  leftUpperArm: THREE.Group;
  leftForearm: THREE.Group;
  leftHand: THREE.Group;
  rightShoulder: THREE.Group;
  rightUpperArm: THREE.Group;
  rightForearm: THREE.Group;
  rightHand: THREE.Group;
  leftHip: THREE.Group;
  leftThigh: THREE.Group;
  leftShin: THREE.Group;
  leftFoot: THREE.Group;
  rightHip: THREE.Group;
  rightThigh: THREE.Group;
  rightShin: THREE.Group;
  rightFoot: THREE.Group;
  beltGroup: THREE.Group;
}

export interface Athlete3DInstance {
  group: THREE.Group;
  joints: AthleteJoints;
  updateGiColor: (hex: string) => void;
  updateBelt: (belt: Belt, stripes?: number) => void;
  dispose: () => void;
}

const BELT_COLORS: Record<Belt, string> = {
  white: '#f8fafc',
  blue: '#2563eb',
  purple: '#9333ea',
  brown: '#78350f',
  black: '#18181b'
};

export function build3DAthlete(
  giColorHex: string = '#ffffff',
  belt: Belt = 'white',
  stripes: number = 2,
  skinTone: 'light' | 'medium' | 'dark' = 'medium'
): Athlete3DInstance {
  const root = new THREE.Group();
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // Materials
  const giTexture = createGiTexture(giColorHex);
  disposables.push(giTexture);

  const giMaterial = new THREE.MeshStandardMaterial({
    color: giColorHex,
    roughness: 0.85,
    metalness: 0.05,
    map: giTexture,
    bumpMap: giTexture,
    bumpScale: 0.02
  });
  disposables.push(giMaterial);

  const skinMaterial = createSkinMaterial(skinTone);
  disposables.push(skinMaterial);

  const beltHex = BELT_COLORS[belt] || '#f8fafc';
  const beltMaterial = new THREE.MeshStandardMaterial({
    color: beltHex,
    roughness: 0.8,
    metalness: 0.05
  });
  disposables.push(beltMaterial);

  const beltSleeveMaterial = new THREE.MeshStandardMaterial({
    color: belt === 'black' ? '#dc2626' : '#18181b', // Red bar for black belt, black bar for colored belts
    roughness: 0.8
  });
  disposables.push(beltSleeveMaterial);

  const stripeMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  disposables.push(stripeMaterial);

  // Helper for shadow casting meshes
  const makeMesh = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh => {
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // 1. Pelvis / Hips
  const pelvis = new THREE.Group();
  root.add(pelvis);

  const pelvisMesh = makeMesh(
    new THREE.BoxGeometry(0.32, 0.16, 0.22),
    giMaterial
  );
  pelvis.add(pelvisMesh);

  // 2. Spine & Chest (Torso with Gi Jacket)
  const spine = new THREE.Group();
  spine.position.y = 0.10;
  pelvis.add(spine);

  const chest = new THREE.Group();
  chest.position.y = 0.18;
  spine.add(chest);

  // Torso Gi mesh (tapered chest)
  const torsoMesh = makeMesh(
    new THREE.BoxGeometry(0.36, 0.32, 0.24),
    giMaterial
  );
  chest.add(torsoMesh);

  // Crossed Gi Lapels (Gola grossa em V)
  const lapelLeft = makeMesh(
    new THREE.BoxGeometry(0.04, 0.34, 0.06),
    giMaterial
  );
  lapelLeft.position.set(-0.06, 0, 0.11);
  lapelLeft.rotation.z = -0.22;
  chest.add(lapelLeft);

  const lapelRight = makeMesh(
    new THREE.BoxGeometry(0.04, 0.34, 0.06),
    giMaterial
  );
  lapelRight.position.set(0.06, 0, 0.11);
  lapelRight.rotation.z = 0.22;
  chest.add(lapelRight);

  // Belt Group (Waist knot & hanging ends)
  const beltGroup = new THREE.Group();
  beltGroup.position.set(0, -0.14, 0);
  chest.add(beltGroup);

  const beltLoop = makeMesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16),
    beltMaterial
  );
  beltGroup.add(beltLoop);

  // Belt Knot
  const knotMesh = makeMesh(
    new THREE.BoxGeometry(0.08, 0.06, 0.07),
    beltMaterial
  );
  knotMesh.position.set(0, 0, 0.17);
  beltGroup.add(knotMesh);

  // Left Hanging Belt End
  const beltEndLeft = makeMesh(
    new THREE.BoxGeometry(0.045, 0.18, 0.02),
    beltMaterial
  );
  beltEndLeft.position.set(-0.03, -0.09, 0.17);
  beltEndLeft.rotation.z = 0.1;
  beltGroup.add(beltEndLeft);

  // Right Hanging Belt End (with Rank Bar)
  const beltEndRight = makeMesh(
    new THREE.BoxGeometry(0.045, 0.22, 0.02),
    beltMaterial
  );
  beltEndRight.position.set(0.03, -0.11, 0.17);
  beltEndRight.rotation.z = -0.1;
  beltGroup.add(beltEndRight);

  // Rank sleeve on right belt tip
  const rankBar = makeMesh(
    new THREE.BoxGeometry(0.047, 0.06, 0.022),
    beltSleeveMaterial
  );
  rankBar.position.set(0, -0.06, 0.002);
  beltEndRight.add(rankBar);

  // Stripes (graus)
  for (let s = 0; s < Math.min(4, stripes); s++) {
    const stripe = makeMesh(
      new THREE.BoxGeometry(0.048, 0.008, 0.024),
      stripeMaterial
    );
    stripe.position.set(0, -0.015 + s * 0.012, 0);
    rankBar.add(stripe);
  }

  // 3. Neck & Head
  const neck = new THREE.Group();
  neck.position.y = 0.20;
  chest.add(neck);

  const neckMesh = makeMesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.08, 12),
    skinMaterial
  );
  neck.add(neckMesh);

  const head = new THREE.Group();
  head.position.y = 0.12;
  neck.add(head);

  // Cranium / Head
  const headMesh = makeMesh(
    new THREE.SphereGeometry(0.11, 16, 16),
    skinMaterial
  );
  headMesh.scale.set(0.9, 1.1, 1.0);
  head.add(headMesh);

  // Jaw / Chin
  const jawMesh = makeMesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.11),
    skinMaterial
  );
  jawMesh.position.set(0, -0.05, 0.04);
  head.add(jawMesh);

  // Hair cap
  const hairMaterial = new THREE.MeshStandardMaterial({ color: '#1c1917', roughness: 0.9 });
  disposables.push(hairMaterial);
  const hairMesh = makeMesh(
    new THREE.SphereGeometry(0.115, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMaterial
  );
  hairMesh.position.set(0, 0.02, -0.01);
  head.add(hairMesh);

  // Ears (Cauliflower BJJ ears styling)
  const earGeo = new THREE.SphereGeometry(0.03, 8, 8);
  earGeo.scale(0.5, 1.0, 0.8);
  disposables.push(earGeo);
  const leftEar = makeMesh(earGeo, skinMaterial);
  leftEar.position.set(-0.11, 0, 0);
  head.add(leftEar);
  const rightEar = makeMesh(earGeo, skinMaterial);
  rightEar.position.set(0.11, 0, 0);
  head.add(rightEar);

  // 4. Arms (Left & Right)
  // Left Arm
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.21, 0.12, 0);
  chest.add(leftShoulder);

  const leftUpperArm = new THREE.Group();
  leftShoulder.add(leftUpperArm);

  const leftSleeveUpper = makeMesh(
    new THREE.CylinderGeometry(0.07, 0.065, 0.22, 12),
    giMaterial
  );
  leftSleeveUpper.position.y = -0.11;
  leftUpperArm.add(leftSleeveUpper);

  const leftForearm = new THREE.Group();
  leftForearm.position.y = -0.22;
  leftUpperArm.add(leftForearm);

  const leftSleeveLower = makeMesh(
    new THREE.CylinderGeometry(0.065, 0.06, 0.20, 12),
    giMaterial
  );
  leftSleeveLower.position.y = -0.10;
  leftForearm.add(leftSleeveLower);

  const leftHand = new THREE.Group();
  leftHand.position.y = -0.22;
  leftForearm.add(leftHand);

  const leftHandMesh = makeMesh(
    new THREE.BoxGeometry(0.05, 0.08, 0.06),
    skinMaterial
  );
  leftHandMesh.position.y = -0.03;
  leftHand.add(leftHandMesh);

  // Right Arm
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.21, 0.12, 0);
  chest.add(rightShoulder);

  const rightUpperArm = new THREE.Group();
  rightShoulder.add(rightUpperArm);

  const rightSleeveUpper = makeMesh(
    new THREE.CylinderGeometry(0.07, 0.065, 0.22, 12),
    giMaterial
  );
  rightSleeveUpper.position.y = -0.11;
  rightUpperArm.add(rightSleeveUpper);

  const rightForearm = new THREE.Group();
  rightForearm.position.y = -0.22;
  rightUpperArm.add(rightForearm);

  const rightSleeveLower = makeMesh(
    new THREE.CylinderGeometry(0.065, 0.06, 0.20, 12),
    giMaterial
  );
  rightSleeveLower.position.y = -0.10;
  rightForearm.add(rightSleeveLower);

  const rightHand = new THREE.Group();
  rightHand.position.y = -0.22;
  rightForearm.add(rightHand);

  const rightHandMesh = makeMesh(
    new THREE.BoxGeometry(0.05, 0.08, 0.06),
    skinMaterial
  );
  rightHandMesh.position.y = -0.03;
  rightHand.add(rightHandMesh);

  // 5. Legs (Left & Right with Kimono Pants)
  // Left Leg
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.11, -0.08, 0);
  pelvis.add(leftHip);

  const leftThigh = new THREE.Group();
  leftHip.add(leftThigh);

  const leftPantThigh = makeMesh(
    new THREE.CylinderGeometry(0.09, 0.075, 0.28, 12),
    giMaterial
  );
  leftPantThigh.position.y = -0.14;
  leftThigh.add(leftPantThigh);

  const leftShin = new THREE.Group();
  leftShin.position.y = -0.28;
  leftThigh.add(leftShin);

  const leftPantShin = makeMesh(
    new THREE.CylinderGeometry(0.075, 0.065, 0.26, 12),
    giMaterial
  );
  leftPantShin.position.y = -0.13;
  leftShin.add(leftPantShin);

  const leftFoot = new THREE.Group();
  leftFoot.position.y = -0.26;
  leftShin.add(leftFoot);

  const leftFootMesh = makeMesh(
    new THREE.BoxGeometry(0.06, 0.05, 0.14),
    skinMaterial
  );
  leftFootMesh.position.set(0, -0.02, 0.04);
  leftFoot.add(leftFootMesh);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(0.11, -0.08, 0);
  pelvis.add(rightHip);

  const rightThigh = new THREE.Group();
  rightHip.add(rightThigh);

  const rightPantThigh = makeMesh(
    new THREE.CylinderGeometry(0.09, 0.075, 0.28, 12),
    giMaterial
  );
  rightPantThigh.position.y = -0.14;
  rightThigh.add(rightPantThigh);

  const rightShin = new THREE.Group();
  rightShin.position.y = -0.28;
  rightThigh.add(rightShin);

  const rightPantShin = makeMesh(
    new THREE.CylinderGeometry(0.075, 0.065, 0.26, 12),
    giMaterial
  );
  rightPantShin.position.y = -0.13;
  rightShin.add(rightPantShin);

  const rightFoot = new THREE.Group();
  rightFoot.position.y = -0.26;
  rightShin.add(rightFoot);

  const rightFootMesh = makeMesh(
    new THREE.BoxGeometry(0.06, 0.05, 0.14),
    skinMaterial
  );
  rightFootMesh.position.set(0, -0.02, 0.04);
  rightFoot.add(rightFootMesh);

  const joints: AthleteJoints = {
    root,
    pelvis,
    spine,
    chest,
    neck,
    head,
    leftShoulder,
    leftUpperArm,
    leftForearm,
    leftHand,
    rightShoulder,
    rightUpperArm,
    rightForearm,
    rightHand,
    leftHip,
    leftThigh,
    leftShin,
    leftFoot,
    rightHip,
    rightThigh,
    rightShin,
    rightFoot,
    beltGroup
  };

  return {
    group: root,
    joints,
    updateGiColor: (hex: string) => {
      giMaterial.color.set(hex);
      if (giMaterial.map) {
        giMaterial.map.dispose();
        const newTex = createGiTexture(hex);
        giMaterial.map = newTex;
        giMaterial.bumpMap = newTex;
        giMaterial.needsUpdate = true;
      }
    },
    updateBelt: (newBelt: Belt) => {
      const hex = BELT_COLORS[newBelt] || '#f8fafc';
      beltMaterial.color.set(hex);
      beltSleeveMaterial.color.set(newBelt === 'black' ? '#dc2626' : '#18181b');
    },
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    }
  };
}
