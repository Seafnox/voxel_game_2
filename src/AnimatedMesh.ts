import { SkinnedMesh, Geometry, MeshBasicMaterial, AnimationMixer, AnimationClip } from 'three';

export class AnimatedMesh extends SkinnedMesh {
  mixer: AnimationMixer;
  private animations: Record<string, AnimationClip> = {};
  private currentAnimation: string | undefined;

  constructor(geometry: Geometry, material: MeshBasicMaterial) {
    super(geometry, material);

    this.mixer = new AnimationMixer(this);

    (this.geometry as Geometry).animations.forEach(anim => {
      this.animations[anim.name] = anim;
    });

    this.playAnimation('walk');
  }

  playAnimation(name: string) {
    this.currentAnimation && this.mixer.stopAllAction(this.animations[this.currentAnimation]);
    let anim = this.animations[name];
    if (anim) {
      let action = this.mixer.clipAction(anim, this);
      action.play();
      this.currentAnimation = name;
    } else {
      console.warn(`Animation ${name} does not exist.`);
    }
  }

  getCurrentAnimation(): string | undefined {
    return this.currentAnimation;
  }

}
