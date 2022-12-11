<?php
namespace database;

class BaseDB {

    private $_DBhost;
    private $_DBuser;
    private $_DBpassword;
    private $_DBname;
    protected $Max_size;
    protected $Tempfile_path;
    protected $Storage_path;
    protected $Mysql;

    function __construct()
    {
        $this -> _set_database();
        $this -> _set_path();
    }

    private function _set_database() {
        $path = "/etc/php/8.1/cli/php.ini";
        $php_default = parse_ini_file($path);
        $this -> _DBhost = $php_default['mysqli.default_host'];
        $this -> _DBuser = $php_default['mysqli.default_user'];
        $this -> _DBpassword = $php_default['mysqli.default_pw'];
        $this -> _DBname = 'WSP';
    }

    private function _set_path() {
        $path = "/etc/php/8.1/cli/php.ini";
        $php_default = parse_ini_file($path);
        $this -> Max_size = $php_default['ptmp.storage_maxsize'];
        $this -> Tempfile_path = $php_default['ptmp.path'];
        $this -> Storage_path = $php_default['ptmp.storage_path'];
    }

    public function Database_connect() {
        try {
            $this -> Mysql = mysqli_connect(
                $this->_DBhost, $this->_DBuser,
                $this->_DBpassword, $this->_DBname);
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

    public function Get_maxsize() {
        return $this -> Max_size;
    }

    public function Get_patient_id() {
        return $this -> _patient_id ?: NULL;
    }

    public function Get_storage_size() {
        $f = $this -> Storage_path . $this -> _patient_id . "/";
        $io = popen ('/usr/bin/du -sk ' . $f, 'r');
        $size = fgets ($io, 4096);
        $size = substr ($size, 0, strpos ( $size, "\t" ));
        pclose ($io);
        return $size;
    }

    public function Check_login() {
        $path = "/etc/php/8.1/cli/php.ini";
        $php_default = parse_ini_file($path);
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

    public function Insert_predict_result($area, $date, $origin, $unresize_origin, $predict) {
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

    public function Update_iou_result($store_path, $cur_date) {
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
}
?>