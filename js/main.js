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

    app.stage.addChild(back);

    // Create a controller that handles keyboard inputs.
    const controller = new Controller();

    let play = new Player(0);
    await play.load();
    play.spawn(200, 400);
    app.stage.addChild(play.view);
    app.ticker.add(delta => {
        // Update character's state based on the controller's input.
        play.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
        if (play.state.run && play.state.walk) play.state.run = true;
        else play.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
        play.state.defense = controller.keys.down.pressed;
        if (controller.keys.left.pressed) play.direction = -1;
        else if (controller.keys.right.pressed) play.direction = 1;
        play.state.jump = controller.keys.up.pressed;

        // Update character's animation based on the latest state.
        play.update();

        // Determine the scene's horizontal scrolling speed based on the character's state.
        let speed = 1.25;

        if (play.state.run) speed = 3.75;
        else if (play.state.hjump) speed = 7.5;

        // Shift the scene's position based on the character's facing direction, if in a movement state.
        //if (play.state.walk) back.positionX -= speed * back.scale * play.direction;
    });

    PIXI.sound.add('BGM_login_1', 'assests/sound/BGM/BGM_login_1.mp3');
    PIXI.sound.play('BGM_login_1', {
        loop: true
    });
    
}

Main();

