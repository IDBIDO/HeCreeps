

type DepartmentName = 'dpt_harvest'| 'dpt_logistic'| 'dpt_build'| 'dpt_upgrade'| 'dpt_repair'

/***************************************************
 *                   CREEP SPAWN                   *
 ***************************************************/
interface CreepSpawnMemory {
    spawnId: string[];
    spawnTask: {
        0: SpawnTaskSet;
        1: SpawnTaskSet;
        2: SpawnTaskSet;
    }
}

type SpawnTaskSet = {[creepName: string]: SpawnTask}
type SpawnTask = {    body: BodyMode; creepMemory: CreepMemory; }

type BodyMode = 'default' | 'big'

/***************************************************
 *                   CREEPS                        *
 ***************************************************/



interface CreepMemory {
    role: CreepRole;
    taskData: CreepTaskData;

    working:  boolean;
    ready:  boolean;
    dontPullMe: boolean;

    workStationID:  string;
    departmentName:  DepartmentName;
    roomName:  string;
}

// CREEP ROLE
type CreepRole = HarvesterRole | TransporterRole
type HarvesterRole = 'harvester' | 'initializer'
type TransporterRole = 'transporter';

// CREEP TASK DATA
type CreepTaskData = HarvesterTaskData | TransporterTaskData

interface HarvesterTaskData {
    sourceInfo: ID_Room_position;   // source
    targetInfo: ID_Room_position;   // save
    workPosition: [number, number];
}

interface TransporterTaskData {
    stationId: string;
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    amount:  number;
    resourceType:  ResourceConstant;
    taskObjectInfo?: ID_Room_position;
    creepList?: string[];   // only for move task
}

/************** CREEP WORK ********************/
type CreepWork = {
    [role in CreepRole]: (data: CreepTaskData) => ICreepConfig
}

interface ICreepConfig {
    /*
    // 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
    isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
    // 准备阶段执行的方法, 返回 true 时代表准备完成
    prepare?: (creep: Creep) => boolean;
    // creep 获取工作所需资源时执行的方法
    // 返回 true 则执行 target 阶段，返回其他将继续执行该方法
    */
    prepare?: (creep: Creep) => boolean

    source?: (creep: Creep) => boolean;
    // creep 工作时执行的方法,
    // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
    target: (creep: Creep) => boolean;

    // 每个角色默认的身体组成部分
    //bodys: BodyPartConstant[];
}




/***************************************************
 *                   STATION                       *
 ***************************************************/
type StationMemory = HarvestStationMemory

// CREEP CONFIG -> equal for all departments
interface  CreepSpawnConfig {
    //role:  string;
    body:  'default' | 'big';          // body mode: default, manual
    priority:  number;
    creepMemory:  CreepMemory
}

// STATION TYPE
type StationType = HarvesterStationType | BuilderStationType | UpgraderStationType | RepairerStationType | LogisticStationType;
type HarvesterStationType = 'source1' | 'source2' | 'mineral' | 'highway' | null;
type BuilderStationType = 'interiorConstructor' | 'externalConstructor' | null;
type UpgraderStationType = 'internal' | 'external' |null;
type RepairerStationType = 'withLinkRepairer' | 'noLinkRepairer' | null;
type LogisticStationType = 'internal' | 'external' | null;

// CREEP LIST
type CreepList = HarvesterCreepStateSet | TransporterCreepStateSet

/***************************************************
 *             HARVESTER STATION                   *
 ***************************************************/

/*
    To initialize: creepConfig, creepTask, needTransporterCreep, transporterSetting


 */

interface HarvestStationMemory {
    order: HarvesterWorkStationOrder [];
    creepList: HarvesterCreepStateSet;
    creepConfig:  CreepSpawnConfig;
    taskData: {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position
        workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    }
    //distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting:  TransporterTaskData;
}

// ORDER
type HarvesterWorkStationOrderType = 'DELETE_CREEP' | 'ADD_CREEP' | 'SET_TRANSPORTER_CREEP' | 'UNSET_TRANSPORTER_CREEP';
type HarvesterWorkStationOrder = {name: HarvesterWorkStationOrderType, data: {}}

// CREEP LIST
type HarvesterCreepStateSet = {[creepName: string]: HarvesterCreepState }
interface HarvesterCreepState {  deadTick: number; workPosition: [number, number]; workRoomName: string;}

/***************************************************
 *             LOGISTIC STATION                   *
 ***************************************************/

interface LogisticStationMemory {
    creepList: TransporterCreepStateSet;
    creepConfig:  CreepSpawnConfig;
    fillTask:number;
    taskList:{
        MOVE: {
            [id: string]: TransporterTaskData
        },
        TRANSFER: {
            [id: string]: TransporterTaskData
        },
        WITHDRAW: {
            [id: string]: TransporterTaskData
        },
    }
    availableCreepList: string[];

}

type TransporterCreepStateSet = {[creepName: string]: TransporterCreepState }
interface TransporterCreepState {  deadTick: number; }

/***************************************************
 *                 UTILS TYPE                      *
 ***************************************************/

interface ID_Room_position {
    id: string;
    roomName: string;
    pos: [number, number];
}

interface modelData {
    id: string;
    pos: [number, number];
}
