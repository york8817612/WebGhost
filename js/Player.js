
const animationMap = {
    stand: {
        name: 'stand',
        loop: true,
    },
    walk: {
        name: 'walk',
        loop: true,
    },
    run: {
        name: 'run',
        loop: true,
    },
    jump: {
        name: 'jump',
        timeScale: 1.5,
    },
    hjump: {
        name: 'hjump',
        timeScale: 3,
    },
    defense: {
        name: 'defense',
        loop: true,
    },
    dead: {
        name: 'dead',
        loop: true,
    },
    attack: {
        name: 'attack',
        loop: true,
    },
};


const ACTION_TYPE = {
    AREADY_1: {
        name: 'AREADY_1',
        loop: true,
    },
    ASTAND_1:  {
        name: 'ASTAND_1',
        loop: true,
    },
    ATTACK_1:  {
        name: 'ATTACK_1',
        loop: true,
    },
    ATTACK_2:  {
        name: 'ATTACK_2',
        loop: true,
    },
    ATTACK_3:  {
        name: 'ATTACK_3',
        loop: true,
    },
    ATTACK_4:  {
        name: 'ATTACK_4',
        loop: true,
    },
    ATTACK_5:  {
        name: 'ATTACK_5',
        loop: true,
    },
    ATTACK_6:  {
        name: 'ATTACK_6',
        loop: true,
    },
    ATTACK_7:  {
        name: 'ATTACK_7',
        loop: true,
    },
    DAMAGE_1:  {
        name: 'DAMAGE_1',
        loop: true,
    },
    DAMAGE_2:  {
        name: 'DAMAGE_2',
        loop: true,
    },
    DEAD_1:  {
        name: 'DEAD_1',
        loop: true,
    },
    DEFENSE_1:  {
        name: 'DEFENSE_1',
        loop: true,
    },
    HJUMP_1:  {
        name: 'HJUMP_1',
        loop: true,
    },
    HJUMP_2:  {
        name: 'HJUMP_2',
        loop: true,
    },
    HJUMP_3:  {
        name: 'HJUMP_3',
        loop: true,
    },
    HJUMP_4:  {
        name: 'HJUMP_4',
        loop: true,
    },
    LJUMP_1:  {
        name: 'LJUMP_1',
        timeScale: (1/15),
        loop: true,
    },
    LJUMP_2:  {
        name: 'LJUMP_2',
        timeScale: 1.5,
        loop: true,
    },
    RUN_1:  {
        name: 'RUN_1',
        loop: true,
        timeScale: (1/5),
    },
    SCREAM_1:  {
        name: 'SCREAM_1',
        loop: true,
    },
    SPELL_1:  {
        name: 'SPELL_1',
        loop: true,
    },
    SPELL_2:  {
        name: 'SPELL_2',
        loop: true,
    },
    SPELL_3:  {
        name: 'SPELL_3',
        loop: true,
    },
    STAND_1:  {
        name: 'STAND_1',
        loop: true,
    },
    STICK_1:  {
        name: 'STICK_1',
        loop: true,
    },
    STICK_2:  {
        name: 'STICK_2',
        loop: true,
    },
    STICK_3:  {
        name: 'STICK_3',
        loop: true,
    },
    STRETCH_1:  {
        name: 'STRETCH_1',
        loop: true,
    },
    UPPER_1:  {
        name: 'UPPER_1',
        loop: true,
    },
    UPPER_2:  {
        name: 'UPPER_2',
        loop: true,
    },
    WALK_1:  {
        name: 'WALK_1',
        loop: true,
    }
}

class Player {
    constructor(gender) {
        this._gender = gender;
        this._action = ACTION_TYPE.STAND_1.name;
        this._body = {};
        this._eyes = {};
        this._bodySpritesheet = {};
        this._eyeSpritesheet = {};
        this.directionalView = {};
        this.view = {};
        this.state = {
            walk: false,
            run: false,
            stand: false,
            jump: false,
            comedown: false,
            hjump: false,
            defense: false,
            dead: false,
            attack: false
        };
    }

    load = async () => {
        let path = (this._gender == 0 ? '/assests/data/OBJ/boy' : '/assests/data/OBJ/girl')
        let spr = new SprReader(path, 0)
        let mot = new MotReader(path, 0)
        let motFile = await mot.MotFileLoader()
        let sprFile = await spr.SprFileLoader()
        let jsonData = spr.getAnimations(sprFile.files, motFile, 0);
        console.log(jsonData);
        let imgURL = await spr.loadToDataURL(sprFile.files, 0);
        const texture = await PIXI.Assets.load(imgURL);
        
        let spritesheet = new PIXI.Spritesheet(
            texture,
            jsonData
        );
        await spritesheet.parse();
        this._bodySpritesheet = spritesheet

        
        let eyes = new SprReader('assests/data/Avatar/eye', 1);
        let eyeMot = new MotReader('assests/data/Avatar/eye', 1)
        let eye = await eyes.SprFileLoader();
        let eyeMotFile = await eyeMot.MotFileLoader();
        let eyeJsonData = eyes.getAnimations(eye.files, eyeMotFile, 0);
        console.log(eyeJsonData);
        let eyeImgURL = await eyes.loadToDataURL(eye.files, 0);
        const eyeTexture = await PIXI.Assets.load(eyeImgURL);

        let eyeSpritesheet = new PIXI.Spritesheet(
            eyeTexture,
            eyeJsonData
        );
        await eyeSpritesheet.parse();
        this._eyeSpritesheet = eyeSpritesheet;
    }

    spawn = (x, y) => {
        // Create the main view and a nested view for directional scaling.
        this.view = new PIXI.Container();
        this.directionalView = new PIXI.Container();
        
        this._action = ACTION_TYPE.STAND_1.name;

        this._body = new PIXI.AnimatedSprite(this._bodySpritesheet.animations[this._action]);
        this._eyes = new PIXI.AnimatedSprite(this._eyeSpritesheet.animations[this._action]);
        
        // set the animation speed
        this._body.animationSpeed = 1/10;
        this._eyes.animationSpeed = 1/10;
        
        this._body.updateAnchor = true;
        this._eyes.updateAnchor = true;
        this._body.x = 0;
        this._body.y = 0;
        this._eyes.x = this._body.x + -10;
        this._eyes.y = this._body.y + -50;
        
        // play the animation on a loop
        this._body.play();
        this._eyes.play();

        // add it to the stage to render
        this.directionalView.addChild(this._body);
        this.directionalView.addChild(this._eyes);
        
        this.view.x = x;
        this.view.y = y;

        this.view.addChild(this.directionalView);

        this._body.onComplete = () => {

        };
        this._body.onFrameChange = () => {
            
        };
    }

    setAnimation = (action, loop) => {
        this._action = action;
        this._body.textures = this._bodySpritesheet.animations[action];
        this._body.loop = loop;
        this._body.play();
    }

    // Play the spine animation.
    playAnimation({ name, loop = false, timeScale = 1/10 })
    {
        // Skip if the animation is already playing.
        if (this.currentAnimationName === name) return;

        // Play the animation on main track instantly.
        this.setAnimation(name, loop);

        // Apply the animation's time scale (speed).
        this._body.animationSpeed = timeScale;
    }

    update()
    {
        // Play the jump animation if not already playing.
        if (this.state.jump) 
        {
            this.playAnimation(ACTION_TYPE.LJUMP_1);
        }

        // Skip the rest of the animation updates during the jump animation.
        if (this.isAnimationPlaying(ACTION_TYPE.LJUMP_1)) 
        {
            return;
        }

        // Handle the character animation based on the latest state and in the priority order.
        if (this.state.dead) this.playAnimation(ACTION_TYPE.DEAD_1);
        else if (this.state.run) this.playAnimation(ACTION_TYPE.RUN_1);
        else if (this.state.walk) this.playAnimation(ACTION_TYPE.WALK_1);
        else if (this.state.defense) this.playAnimation(ACTION_TYPE.DEFENSE_1);
        else this.playAnimation(ACTION_TYPE.STAND_1);
    }

    isAnimationPlaying({ name })
    {
        // Check if the current animation on main track equals to the queried.
        // Also check if the animation is still ongoing.
        return this.currentAnimationName === name && !this._body.playing;
    }

    // Return the name of the current animation on main track.
    get currentAnimationName()
    {
        return this._action;
    }

    get direction()
    {
        return this.directionalView.scale.x > 0 ? 1 : -1;
    }

    // Set character's facing direction.
    set direction(value)
    {
        this.directionalView.scale.x = value;
    }
}