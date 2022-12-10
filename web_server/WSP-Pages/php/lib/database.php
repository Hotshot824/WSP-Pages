<?php
namespace database;

class BaseDB {

    protected $DBhost;
    protected $DBuser;
    protected $DBpassword;
    protected $DBname;
    protected $Tempfile_path;
    protected $Mysql;

    function __construct()
    {
        $this -> _set_database();
        $this -> _set_path();
    }

    private function _set_database() {
        $path = "/etc/php/8.1/cli/php.ini";
        $db_default = parse_ini_file($path);
        $this -> DBhost = $db_default['mysqli.default_host'];
        $this -> DBuser = $db_default['mysqli.default_user'];
        $this -> DBpassword = $db_default['mysqli.default_pw'];
        $this -> DBname = 'WSP';
    }

    private function _set_path() {
        $path = "/etc/php/8.1/cli/php.ini";
        $db_default = parse_ini_file($path);
        $this -> Tempfile_path = $db_default['ptmp.path'];
    }

    public function database_connect() {
        try {
            $this -> Mysql = mysqli_connect(
                $this->DBhost, $this->DBuser,
                $this->DBpassword, $this->DBname);
        } catch (\Exception $e){
            return "Error: Database connection error!";
        }
    }
}

class WSPDB extends BaseDB {
    private $_lifetime;
    private $_patient_id;
    private $_upload_path;

    function __construct($stay_in = FALSE)
    {
        parent::__construct();
        $this -> _set_lifetime($stay_in);
    }

    private function _set_lifetime($stay_in) {
        if ($stay_in) {
            $this ->_lifetime = 86400;
        }
    } 

    public function check_login() {
        if (isset($this -> _lifetime)) {
            ini_set("session.gc_maxlifetime", $this->_lifetime);
        }
        session_save_path($this -> Tempfile_path);
        session_start();
        if (isset($_SESSION['patientID'])) {
            $this -> _patient_id = $_SESSION['patientID'];
            return TRUE;
        }
        return FALSE;
    } 

    public function insert_predict_result($area, $date, $origin, $unresize_origin, $predict) {
        $insert = "INSERT INTO `backend_area`(`patient_id`, `area`, `date`, ".
        "`original_img`, `unresize_original_img` ,`predict_img`)" .
        " VALUES ('" . $this->_patient_id . "','" . $area . "', '" . $date . "','" . 
        $origin . "','" . $unresize_origin . "','" . $predict . "')";

        if ($this -> Mysql) {
            try {
                mysqli_query($this -> Mysql, $insert);
            } catch (\Exception $e){
                return "Error: Predict result database insert error!";
            }
        }
    }

    public function update_iou_result($store_path, $cur_date) {
        $update = "UPDATE `backend_area` " .
        "SET `iou_img` = '" . $store_path . "' " .
        "WHERE `patient_id` = '" . $this->_patient_id . "' AND `original_img` LIKE '%" . $cur_date . "%';";

        if ($this -> Mysql) {
            try {
                mysqli_query($this -> Mysql, $update);
            } catch (\Exception $e){
                return "Error: IOU database update error!";
            }
        }
    }

    public function get_patient_id() {
        return $this -> _patient_id ?: NULL;
    }
}
?>