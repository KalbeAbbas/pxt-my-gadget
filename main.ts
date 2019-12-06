/**
 * XinaBox SL06 extension for makecode
 */
/**
 * SL06 block
 */
// % color=#444444 icon="\uf0eb" % groups=[Colour,Light, Gesture, Proximity, Optional]
namespace SL06 {

    let APDS9960_I2C_ADDR = 0x72;

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
    export function begin(): void {
        return;
    }

    //%blockId=SL06_getMode
    //%block="SL06 get mode"
    //%advanced=true
    //%group=Optional
    export function getMode(): number {
        return 1;
    }

    //%blockId=SL06_setMode
    //%block="SL06 set mode"
    //%advanced=true
    //%group=Optional
    export function setMode(mode: number, enable: number): void {
        return;
    }

    //%blockId=SL06_enablePower
    //%block="SL06 enable power"
    //%group=Optional
    export function enablePower(): void {
        return;
    }

    //%blockId=SL06_disablePower
    //%block="SL06 disable power"
    //%group=Optional
    export function disbalePower(): void {
        return;
    }

    //%blockId=SL06_enableGestureSensor
    //%block="SL06 enable gesture sensor"
    //%group=Gesture
    export function enableGestureSensor(interrupts: boolean = false): void {
        return;
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
    export function setLEDDRiver(drive: number): void {
        return;
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
    export function setGestureLEDDrive(): void {
        return;
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
    export function setProximityGain(): void {
        return;
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

    function wireWriteByte(val: NumberFormat.UInt8BE): boolean
    {
        pins.i2cWriteNumber(APDS9960_I2C_ADDR, val)
        return true;
    }

    function wireWriteDataByte(reg: NumberFormat.UInt8BE, val: NumberFormat.UInt8BE): boolean
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
       return pins.i2cReadNumber(APDS9960_I2C_ADDR,NumberFormat.UInt8BE)
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
