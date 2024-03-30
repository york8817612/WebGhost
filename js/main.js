Main = async () => {

    let app = new PIXI.Application();

    await app.init({ background: '#000', resizeTo: window });

    document.body.appendChild(app.canvas);

    let til = new TileReader('assests/data/Tile/login');
    let ss = await til.TileFileLoader();

    let bgs = new BgReader('assests/data/Back/login');
    let bg = await bgs.BgFileLoader();

    let prj = new PrjReader('assests/data/Project/login');
    let pj = await prj.PrjFileLoader();

    let spr = new SprReader('assests/interface/Login', 0);
    let ui = await spr.SprFileLoader();
    const uurl = await spr.loadToDataURL(ui.files, 0);
    const texture = await PIXI.Assets.load(uurl);
    const back = new PIXI.Sprite(texture);
    back.x = 0;
    back.y = 0;

    // 按鍵
    //     // Opt-in to interactivity
    // sprite.interactive = true;
    // // Shows hand cursor
    // sprite.buttonMode = true;
    // // Pointers normalize touch and mouse
    // sprite.on('pointerdown', onClick);
    // sprite.on('click', onClick); // mouse-only
    // sprite.on('tap', onClick); // touch-only

    app.stage.addChild(back);

    let play = new Player()
    await play.load()
    play.play(app.stage, 200, 200, play.ACTION_TYPE.STAND_1)

    app.ticker.add(delta => {
        const speed = 10;
        let x = play.position.x;
        let y = play.position.y;
        //play.position((play.x + speed * delta) % (back.width + 200), y);
        //play._container.x = (x + speed * delta) % (back.width + 200);
    });

    // const t1 = await PIXI.Assets.load('/images/test.png');
    // const td = {"frames": {

    //     "0":
    //     {
    //         "frame": {"x":0,"y":0,"w":36,"h":77},
    //         "rotated": false,
    //         "trimmed": false,
    //         "spriteSourceSize": {"x":0,"y":0,"w":36,"h":77},
    //         "sourceSize": {"w":36,"h":77},
    //         "anchor": {"x":0.527778,"y":1.01}
    //     },
    //     "1":
    //     {
    //         "frame": {"x":36,"y":0,"w":36,"h":78},
    //         "rotated": false,
    //         "trimmed": false,
    //         "spriteSourceSize": {"x":0,"y":0,"w":36,"h":78},
    //         "sourceSize": {"w":36,"h":78},
    //         "anchor": {"x":0.555556,"y":1}
    //     },
    //     "2":
    //     {
    //         "frame": {"x":72,"y":0,"w":36,"h":79},
    //         "rotated": false,
    //         "trimmed": false,
    //         "spriteSourceSize": {"x":0,"y":0,"w":36,"h":79},
    //         "sourceSize": {"w":36,"h":79},
    //         "anchor": {"x":0.555556,"y":1.01}
    //     }},
    //     "meta": {
    //         "app": "https://www.codeandweb.com/texturepacker",
    //         "version": "1.1",
    //         "image": "test.png",
    //         "format": "RGBA8888",
    //         "size": {"w":108,"h":79},
    //         "scale": "1",
    //         "smartupdate": "$TexturePacker:SmartUpdate:80d385f499c33f6ce2c1e7e5c534b0c8:968203b3e5a0618a3adb5f691025b1d0:02ab132358d6d8b512e80119463a8329$"
    //     },
    //     "animations":
    //     {
    //         "STAND_1": [0, 1, 2, 1]
    //     }
    // }
        
        
    // let st = new PIXI.Spritesheet(
    //     t1,
    //     td
    // );
    // await st.parse();
    // const anim = new PIXI.AnimatedSprite(st.animations[play.ACTION_TYPE.STAND_1]);
    // anim.x = 300;
    // anim.y = 300;
    // anim.animationSpeed = 0.10;
    // anim.updateAnchor = true;
    // anim.play();
    // app.stage.addChild(anim);

    document.addEventListener('keydown',(e) => {
        switch(e.key.toLowerCase()) {
            case "s":
            case "arrowdown":
                play._container.y += 5;
                //play.position(x, y - 5);
                break;
            case "w":
            case "arrowup":
                play._container.y -= 5;
                //play.position(x, y + 5);
                break;
            case "a":
            case "arrowleft":
                play._container.x -= 5;
                //play.position(x - 5, y);
                break;
            case "d":
            case "arrowright":
                play._container.x += 5;
                //play.position(x + 5, y);
                break;
            default:
                break;
        }
    })


    PIXI.sound.add('BGM_login_1', 'assests/sound/BGM/BGM_login_1.mp3');
    PIXI.sound.play('BGM_login_1', {
        loop: true
    });
    
}

Main();

