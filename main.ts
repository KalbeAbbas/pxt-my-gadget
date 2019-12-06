/**
 * XinaBox SL06 extension for makecode
 */
/**
 * SL06 block
 */
//% color=#444444 icon="\uf0eb"
//% groups=[Colour,Light, Gesture, Proximity, Optional]
namespace SL06 {

    let APDS9960_I2C_ADDR = 0x72;
    let APDS9960_ID_1 = 0xAB
    let APDS9960_ID_2 = 0X9c

    let gesture_data_u_data =  pins.createBuffer(32);
    let gesture_data_d_data = pins.createBuffer(32);
    let gesture_data_l_data = pins.createBuffer(32);
    let gesture_data_r_data = pins.createBuffer(32);
    let gesture_data_index: NumberFormat.UInt8BE
    let gesture_data_total_gestures: NumberFormat.UInt8BE;
    let gesture_data_in_threshold: NumberFormat.UInt8BE;
    let gesture_data_out_threshold: NumberFormat.UInt8BE;

    let gesture_ud_delta_ = 0;
    let gesture_lr_delta_ = 0;

    let gesture_ud_count_ = 0;
    let gesture_lr_count_ = 0;

    let gesture_near_count_ = 0;
    let gesture_far_count_ = 0;

    let gesture_state_ = 0;
    let gesture_motion_ = "none";

    //%blockId=SL06_begin
    //%block="SL06 begin"
    //%advanced=true
    //%group=Optional
    export function begin(): boolean {
        let id: number
        id = wireReadDataByte(APDS9960_I2C_ADDR)

        if (!(id == APDS9960_ID_1 || id == APDS9960_ID_2)) return false

        /* Set ENABLE register to 0 (disable all features) */
        // ALL, OFF
        if (!setMode(7, 0)) {
            return false;
        }

        /* Set default values for ambient light and proximity registers */
        // APDS9960_ATIME, DEFAULT_ATIME
        wireWriteDataByte(0x81, 219)

        // APDS9960_WTIME, DEFAULT_WTIME
        wireWriteDataByte(0x83, 246)

        //APDS9960_PPULSE, DEFAULT_PROX_PPULSE
        wireWriteDataByte(0x8E, 0x87)

        // APDS9960_POFFSET_UR, DEFAULT_POFFSET_UR
        wireWriteDataByte(0x9D, 0)

        // APDS9960_POFFSET_DL, DEFAULT_POFFSET_DL
        wireWriteDataByte(0x9E, 0)

        // APDS9960_CONFIG1, DEFAULT_CONFIG1
        wireWriteDataByte(0x8D, 0x60)

        // DEFAULT_LDRIVE
        setLEDDrive(0)

        // DEFAULT_PGAIN
        setProximityGain(2)

        // DEFAULT_AGAIN
        setAmbientLightGain(1)

        // DEFAULT_PILT
        setProxIntLowThresh(0)

        // DEFAULT_PIHT
        setProxIntHighThresh(50)

        // DEFAULT_AILT
        setLightIntLowThreshold(0xFFFF)

        // DEFAULT_AIHT
        setLightIntHighThreshold(0)

        // APDS9960_PERS, DEFAULT_PERS
        wireWriteDataByte(0x8C, 0x11)

       // APDS9960_CONFIG2, DEFAULT_CONFIG2
        wireWriteDataByte(0x90, 0x01)

        // APDS9960_CONFIG3, DEFAULT_CONFIG3
        wireWriteDataByte(0x9F, 0)

        // DEFAULT_GPENTH
        setGestureEnterThresh(40)

        // DEFAULT_GEXTH
        setGestureExitThresh(30)

        // APDS9960_GCONF1, DEFAULT_GCONF1
        wireWriteDataByte(0xA2, 0x40)

        // DEFAULT_GGAIN
        setGestureGain(2)

        // DEFAULT_GLDRIVE
        setGestureLEDDrive(0)

        // DEFAULT_GWTIME
        setGestureWaitTime(1)

        // APDS9960_GOFFSET_U, DEFAULT_GOFFSET
        wireWriteDataByte(0xA4, 0)

        // APDS9960_GOFFSET_D, DEFAULT_GOFFSET
        wireWriteDataByte(0xA5, 0)

        // APDS9960_GOFFSET_L, DEFAULT_GOFFSET
        wireWriteDataByte(0xA7, 0)

        // APDS9960_GOFFSET_R, DEFAULT_GOFFSET
        wireWriteDataByte(0xA9, 0)

        // APDS9960_GPULSE, DEFAULT_GPULSE
        wireWriteDataByte(0xA6, 0xC9)

        // APDS9960_GCONF3, DEFAULT_GCONF3
        wireWriteDataByte(0xAA, 0)

        // DEFAULT_GIEN
        setGestureIntEnable(0)

        return true;
    }

    //%blockId=SL06_getMode
    //%block="SL06 get mode"
    //%advanced=true
    //%group=Optional
    export function getMode(): NumberFormat.UInt8BE
    {
        let enable_value: NumberFormat.UInt8BE;

        /* Read current ENABLE register */
        // APDS9960_ENABLE
        enable_value = wireReadDataByte(0x80)

        return enable_value;
    }

    //%blockId=SL06_setMode
    //%block="SL06 set mode"
    //%advanced=true
    //%group=Optional
    export function setMode(mode: NumberFormat.UInt8BE, enable: NumberFormat.UInt8BE): boolean {
        let reg_val: NumberFormat.UInt8BE;

        /* Read current ENABLE register */
        reg_val = getMode();
        // ERROR value
        if (reg_val == 0xFF) {
            return false;
        }

        /* Change bit(s) in ENABLE register */
        enable = enable & 0x01;
        if (mode >= 0 && mode <= 6) {
            if (enable) {
                reg_val |= (1 << mode);
            }
            else {
                reg_val &= ~(1 << mode);
            }
        }
        // ALL mode
        else if (mode == 7) {
            if (enable) {
                reg_val = 0x7F;
            }
            else {
                reg_val = 0x00;
            }
        }

        /* Write value back to ENABLE register */
        // APDS9960_ENABLE
        wireWriteDataByte(0x80, reg_val)

        return true;
    }


    //%blockId=SL06_enablePower
    //%block="SL06 enable power"
    //%group=Optional
    export function enablePower()
    {
        setMode(0, 1)
    }

    //%blockId=SL06_disablePower
    //%block="SL06 disable power"
    //%group=Optional
    export function disbalePower() {
        setMode(0, 0)
    }

    //%blockId=SL06_enableGestureSensor
    //%block="SL06 enable gesture sensor"
    //%group=Gesture
    export function enableGestureSensor(interrupts: boolean)
    {

        /* Enable gesture mode
           Set ENABLE to 0 (power off)
           Set WTIME to 0xFF
           Set AUX to LED_BOOST_300
           Enable PON, WEN, PEN, GEN in ENABLE 
        */
        resetGestureParameters();

        wireWriteDataByte(0x83, 0xFF)

        //APDS9960_PPULSE, DEFAULT_GESTURE_PPULSE
        wireWriteDataByte(0x8E, 0x89)

        // LED_BOOST_300
        setLEDBoost(3)

        if (interrupts) {
            if (!setGestureIntEnable(1)) {
                return false;
            }
        }
        else {
            if (!setGestureIntEnable(0)) {
                return false;
            }
        }
        setGestureMode(1)

        enablePower()

        // WAIT
        setMode(3, 1)

        // PROXIMITY
        if (!setMode(2, 1)) {
            return false;
        }
        // GESTURE
        setMode(6, 1)

        return true;
    }

    //%blockId=SL06_disableGestureSensor
    //%block="SL06 disable gesture sensor"
    //%group=Gesture
    export function disableGestureSensor(): void {
        return;
    }

    //%blockId=SL06_getLEDDRiver
    //%block="SL06 get LED driver"
    //%advanced=true
    //%group=Optional
    export function getLEDDRiver(): void {
        return;
    }

    //%blockId=SL06_setLEDDRiver
    //%block="SL06 set LED driver"
    //%advanced=true
    //%group=Optional
    export function setLEDDrive(drive: NumberFormat.UInt8BE): boolean
    {
        let val: NumberFormat.UInt8BE = 0;

        /* Read value from CONTROL register */
        // APDS9960_CONTROL
        val = wireReadDataByte(0x8F)

        /* Set bits in register to given value */
        drive &= 0b00000011;
        drive = drive << 6;
        val &= 0b00111111;
        val |= drive;

        /* Write register value back into CONTROL register */
        // APDS9960_CONTROL, val
        wireWriteDataByte(0x8F, val)

        return true;
    }

    //%blockId=SL06_getGestureLEDDrive
    //%block="SL06 get gesture LED drive"
    //%advanced=true
    //%group=Gesture
    export function getGestureLEDDrive(drive: number): void {
        return;
    }

    //%blockId=SL06_setGestureLEDDrive
    //%block="SL06 set gesture LED drive"
    //%group=Gesture
    //%advanced=true
    function setGestureLEDDrive(drive: number) {
        let val: number;

        /* Read value from GCONF2 register */
        // APDS9960_GCONF2
        val = wireReadDataByte(0xA3)
        /* Set bits in register to given value */
        drive &= 0b00000011;
        drive = drive << 3;
        val &= 0b11100111;
        val |= drive;

        /* Write register value back into GCONF2 register */
        // APDS9960_GCONF2
        if (!wireWriteDataByte(0xA3, val)) {
            return false;
        }

        return true;
    }

    //%blockId=SL06_getGestureGain
    //%block="SL06 get gesture gain"
    //%advanced=true
    //%group=Gesture
    export function getGestureGain(): void {
        return;
    }

    //%blockId=SL06_setGestureGain
    //%block="SL06 set gesture gain"
    //%advanced=true
    //%group=Gesture
    export function setGestureGain(gain: number): void {
        return;
    }

    //%blockId=SL06_getGestureIntEnable
    //%block="SL06 get gesture int enable"
    //%advanced=true
    //%group=Gesture
    export function getGestureIntEnable(): void {
        return;
    }

    //%blockId=SL06_setGestureIntEnable
    //%block="SL06 set gesture int enable"
    //%group=Gesture
    //%advanced=true
    export function setGestureIntEnable(enable: number): void {
        return;
    }

    //%blockId=SL06_isGestureAvailable
    //%block="SL06 is gesture available"
    //%group=Gesture
    export function isGestureAvailable(): boolean {
        return true;
    }

    //%blockId=SL06_getGesture
    //%block="SL06 get gesture"
    //%group=Gesture
    export function getGesture(): number {
        return 1;
    }

    //%blockId=SL06_enableProximitySensor
    //%block="SL06 enable proximity sensor"
    //%group=Proximity
    export function enableProximitySensor(interrupts: boolean): void {
        return;
    }

    //%blockId=SL06_disableProximitySensor
    //%block="SL06 disble proximity sensor"
    //%group=Proximity
    export function disableProximitySensor(): void {
        return;
    }

    //%blockId=SL06_getProximityGain
    //%block="SL06 get proximity gain"
    //%advanced=true
    //%group=Proximity
    export function getProximityGain(): number {
        return 1;
    }

    //%blockId=SL06_setProximityGain
    //%block="SL06 set proximity gain"
    //%advanced=true
    //%group=Proximity
    export function setProximityGain(drive: NumberFormat.UInt8BE)
    {
        let val: number;

        /* Read value from CONTROL register */
        // APDS9960_CONTROL
        val = wireReadDataByte(0x8F)

        /* Set bits in register to given value */
        drive &= 0b00000011;
        drive = drive << 2;
        val &= 0b11110011;
        val |= drive;

        /* Write register value back into CONTROL register */
        // APDS9960_CONTROL
        wireWriteDataByte(0x8F, val)

        return true;
    }

    //%blockId=SL06_getProximity
    //%block="SL06 get proximity"
    //%group=Proximity
    export function getProximity(): number {
        return 1;
    }

    //%blockId=SL06_enableLightSensor
    //%block="SL06 enable light sensor"
    //%group=Light
    export function enableLightSensor(intterupts: boolean = false): void {
        return;
    }

    //%blockId=SL06_disableLightSensor
    //%block="SL06 disable light sensor"
    //%group=Light
    export function disableLightSensor(): void {
        return;
    }

    //%blockId=SL06_getAmbientLightGain
    //%block="SL06 get ambient light gain"
    //%group=Light
    //%advanced=true
    export function getAmbientLightGain(): number {
        return 1;
    }

    //%blockId=SL06_setAmbientLightGain
    //%block="SL06 set ambient light gain"
    //%group=Light
    //%advanced=true
    export function setAmbientLightGain(gain: number): void {
        return
    }

    //%blockId=SL06_clearAmbientLightInt
    //%block="SL06 clear ambient light int"
    //%group=Light
    //%advanced=true
    export function clearAmbientLightInt(): void {
        return;
    }

    //%blockId=SL06_getAmbientLight
    //%block="SL06 get ambient light"
    //%group=Light
    export function getAmbientLight(): number {
        return 1
    }

    //%blockId=SL06_getRedLight
    //%block="SL06 get red light"
    //%group=Light
    export function getRedLight(): number {
        return 1
    }

    //%blockId=SL06_getGreenLight
    //%block="SL06 get green light"
    //%group=Light
    export function getGreenLight(): number {
        return 1
    }

    //%blockId=SL06_getBlueLight
    //%block="SL06 get blue light"
    //%group=Light
    export function getBlueLight(): number {
        return 1;
    }

    function setProxIntLowThresh(threshold: number)
    {
        // APDS9960_PILT
        wireWriteDataByte(0x89, threshold)
    }

    function setProxIntHighThresh(threshold: number)
    {
        // APDS9960_PIHT
        wireWriteDataByte(0x8B, threshold)
    }

    function setLightIntLowThreshold(threshold:number)
    {
        let val_low: number;
        let val_high: number;

        /* Break 16-bit threshold into 2 8-bit values */
        val_low = threshold & 0x00FF;
        val_high = (threshold & 0xFF00) >> 8;

        /* Write low byte */
        // APDS9960_AILTL
        if (!wireWriteDataByte(0x84, val_low)) {
            return false;
        }

        /* Write high byte */
        // APDS9960_AILTH
        if (!wireWriteDataByte(0x85, val_high)) {
            return false;
        }

        return true;
    }

    function setLightIntHighThreshold(threshold: number)
    {
        let val_low: number;
        let val_high: number;

        /* Break 16-bit threshold into 2 8-bit values */
        val_low = threshold & 0x00FF;
        val_high = (threshold & 0xFF00) >> 8;

        /* Write low byte */
        // APDS9960_AIHTL
        if (!wireWriteDataByte(0x86, val_low)) {
            return false;
        }

        /* Write high byte */
        // APDS9960_AIHTH
        if (!wireWriteDataByte(0x87, val_high)) {
            return false;
        }

        return true;
    }

    function setGestureEnterThresh(threshold: number)
        {
        // APDS9960_GPENTH
        if (!wireWriteDataByte(0xA0, threshold)) {
            return false;
        }

        return true;
    }

    function setGestureExitThresh(threshold: number)
    {
        // APDS9960_GEXTH
        if (!wireWriteDataByte(0xA1, threshold)) {
            return false;
        }

        return true;
    }

    function setGestureWaitTime(time: number)
    {
        let val: number;

        /* Read value from GCONF2 register */
        // APDS9960_GCONF2
        val = wireReadDataByte(0xA3)

        /* Set bits in register to given value */
        time &= 0b00000111;
        val &= 0b11111000;
        val |= time;

        /* Write register value back into GCONF2 register */
        // APDS9960_GCONF2
        wireWriteDataByte(0xA3, val)
    }

    function setLEDBoost(boost: number)
    {
        let val:number;

        /* Read value from CONFIG2 register */
        // APDS9960_CONFIG2
        val = wireReadDataByte(0x90)

        /* Set bits in register to given value */
        boost &= 0b00000011;
        boost = boost << 4;
        val &= 0b11001111;
        val |= boost;

        /* Write register value back into CONFIG2 register */
        // APDS9960_CONFIG2
        wireWriteDataByte(0x90, val)
    }

    function setGestureMode(mode: number)
    {
        let val: number;

        /* Read value from GCONF4 register */
        // APDS9960_GCONF4
        val = wireReadDataByte(0xAB)

        /* Set bits in register to given value */
        mode &= 0b00000001;
        val &= 0b11111110;
        val |= mode;

        /* Write register value back into GCONF4 register */
        // APDS9960_GCONF4
        wireWriteDataByte(0xAB, val);
    }

    function resetGestureParameters()
    {
        gesture_data_index = 0;
        gesture_data_total_gestures = 0;

        gesture_ud_delta_ = 0;
        gesture_lr_delta_ = 0;

        gesture_ud_count_ = 0;
        gesture_lr_count_ = 0;

        gesture_near_count_ = 0;
        gesture_far_count_ = 0;

        gesture_state_ = 0;
        gesture_motion_ = 'none';
    }


    function wireWriteByte(val: NumberFormat.UInt8BE): boolean
    {
        pins.i2cWriteNumber(APDS9960_I2C_ADDR, val)
        return true;
    }

    function wireWriteDataByte(reg: number, val: number): boolean
    {
        let buf = pins.createBuffer(2)
        buf[0] = reg;
        buf[1] = val;
        pins.i2cWriteBuffer(APDS9960_I2C_ADDR, buf)
        return true;
    }


    function wireReadDataByte(reg: NumberFormat.UInt8BE): NumberFormat.UInt8BE
    {
       pins.i2cWriteNumber(APDS9960_I2C_ADDR, reg);
       let val: NumberFormat.UInt8BE = pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt8BE)
       return val
    }

    function wireReadDataBlock(reg: NumberFormat.UInt8BE, len:number): Buffer
    {
        let buff = pins.createBuffer(len)

        pins.i2cWriteNumber(APDS9960_I2C_ADDR, reg);
        buff =  pins.i2cReadBuffer(APDS9960_I2C_ADDR, 2)
        return buff
    }

    begin();
}
