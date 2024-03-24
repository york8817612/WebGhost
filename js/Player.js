class Player {
    constructor() {
        this._gender = 0
        this._action = ''
        this._sprite = {}
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
        let sprFile = await spr.SprFileLoader()
        let motFile = await mot.MotFileLoader()
        sprFile.files[0].Json.animations = motFile.aa
        let imgURL = await spr.loadToDataURL(sprFile.files, 0);
        
        const texture = await PIXI.Assets.load(imgURL);
        let spritesheet = new PIXI.Spritesheet(
            texture,
            sprFile.files[0].Json
        );
        await spritesheet.parse();
        this._sprite = spritesheet
    }

    play = (stage, x, y, action) => {

        const container = new PIXI.Container();

        const anim = new PIXI.AnimatedSprite(this._sprite.animations[action]);
        
        anim.anchor.set(0.5);

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
        anim.animationSpeed = 0.10;
        // play the animation on a loop
        anim.play();
        // add it to the stage to render
        container.addChild(anim);

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