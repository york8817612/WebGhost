class Player {
    constructor() {
        this._gender = 0
        this._action = ''
        this._sprite = {}
        this._eye = {}
        this._container = {}
    }

    ACTION_TYPE = {
        AREADY_1: 'AREADY_1',
        ASTAND_1: 'ASTAND_1',
        ATTACK_1: 'ATTACK_1',
        ATTACK_2: 'ATTACK_2',
        ATTACK_3: 'ATTACK_3',
        ATTACK_4: 'ATTACK_4',
        ATTACK_5: 'ATTACK_5',
        ATTACK_6: 'ATTACK_6',
        ATTACK_7: 'ATTACK_7',
        DAMAGE_1: 'DAMAGE_1',
        DAMAGE_2: 'DAMAGE_2',
        DEAD_1: 'DEAD_1',
        DEFENSE_1: 'DEFENSE_1',
        HJUMP_1: 'HJUMP_1',
        HJUMP_2: 'HJUMP_2',
        HJUMP_3: 'HJUMP_3',
        HJUMP_4: 'HJUMP_4',
        LJUMP_1: 'LJUMP_1',
        LJUMP_2: 'LJUMP_2',
        RUN_1: 'RUN_1',
        SCREAM_1: 'SCREAM_1',
        SPELL_1: 'SPELL_1',
        SPELL_2: 'SPELL_2',
        SPELL_3: 'SPELL_3',
        STAND_1: 'STAND_1',
        STICK_1: 'STICK_1',
        STICK_2: 'STICK_2',
        STICK_3: 'STICK_3',
        STRETCH_1: 'STRETCH_1',
        UPPER_1: 'UPPER_1',
        UPPER_2: 'UPPER_2',
        WALK_1: 'WALK_1'
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
        this._sprite = spritesheet

        
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
        this._eye = eyeSpritesheet;

    }

    play = (stage, x, y, action) => {

        const container = new PIXI.Container();

        const body = new PIXI.AnimatedSprite(this._sprite.animations[action]);
        const eye = new PIXI.AnimatedSprite(this._eye.animations[action]);
        
        //anim.anchor.set(0.5);
        //eyeAnim.anchor.set(0.5);

//         const sprites = {
//     'alien death': { start: 1, end: 2 },
//     'boss hit': { start: 3, end: 3.5 },
//     'escape': { start: 4, end: 7.2 },
//     'meow': { start: 8, end: 8.5 },
//     'numkey': { start: 9, end: 9.1 },
//     'ping': { start: 10, end: 11 },
//     'death': { start: 12, end: 16.2 },
//     'shot': { start: 17, end: 18 },
//     'squit': { start: 19, end: 19.3 }
// };


//         const sound = PIXI.sound.Sound.from({
//             'url': 'resources/sprite.mp3',
//             'sprites': sprites
//         });
        
//         // Use the sprite alias to play
//         sound.play('meow');

        
        // set the animation speed
        body.animationSpeed = 1/10;
        eye.animationSpeed = 1/10;
        
        body.updateAnchor = true;
        eye.updateAnchor = true;
        body.x = 0;
        body.y = 0;
        eye.x = -10;
        eye.y = -50;
        // play the animation on a loop
        body.play();
        eye.play();
        // add it to the stage to render
        container.addChild(body);
        container.addChild(eye);

        container.x = x;
        container.y = y;

        this._container = container;
        
        stage.addChild(container);
    }

    position = () => {
        return {x: this._container.x, y: this._container.y}
    }

    position = (x, y) => {
        this._container = x
        this._container = y
    }

}