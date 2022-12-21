/***************************************************
 *                   DEPARTMENTS                   *
 ***************************************************/

type DepartmentName = 'dpt_harvest'| 'dpt_logistic'| 'dpt_build'| 'dpt_upgrade'| 'dpt_repair'




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
    sourceInfo: ID_Room_position;
    targetInfo: ID_Room_position;
    workPosition: [number, number];
}
interface TransporterTaskData {

    stationId: string;
    taskType: LogisticTaskType;
    amount:  number;
    resourceType:  ResourceConstant;
    taskObjectInfo?: ID_Room_position;
    creepList?: string[];
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
    creepMemory:  BasicMemory | ManagerMemory;
}


/***************************************************
 *             HARVESTER STATION                   *
 ***************************************************/

interface HarvestStationMemory {
    order: HarvesterWorkStationOrder [];
    creepList: HarvesterCreepStateSet;
    creepConfig:  CreepSpawnConfig;
    creepTask: {
        sourceInfo: HarvesterSourceInfo;
        targetInfo: HarvesterTargetInfo
        workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    }
    //distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting:  TransporterSetting;
}

// ORDER
type HarvesterWorkStationOrderType = 'DELETE_CREEP' | 'ADD_CREEP' | 'SET_TRANSPORTER_CREEP' | 'UNSET_TRANSPORTER_CREEP';
type HarvesterWorkStationOrder = {name: HarvesterWorkStationOrderType, data: {}}

// CREEP LIST
type HarvesterCreepStateSet = {[creepName: string]: HarvesterCreepState }
interface HarvesterCreepState { creepName: string; deadTick: number; workPosition: [number, number]; workRoomName: string;}




/***************************************************
 *                 UTILS TYPE                      *
 ***************************************************/

interface ID_Room_position {
    id: string;
    roomName: string;
    pos: [number, number];
}
