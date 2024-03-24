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

    const body = document.querySelector('body');

    body.addEventListener('keydown',(e) => {
        let x = play.position.x;
        let y = play.position.y;
        switch(e.keyCode) {
            case 38:
            case 87:
                play.position(x, y - 5);
                break;
            case 40:
            case 83:
                play.position(x, y + 5);
                break;
            case 37:
            case 65:
                play.position(x - 5, y);
                break;
            case 39:
            case 68:
                play.position(x + 5, y);
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

