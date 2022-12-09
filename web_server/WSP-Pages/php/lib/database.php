<?php
namespace database;

class BaseDB {

    protected $_DBhost;
    protected $_DBuser;
    protected $_DBpassword;
    protected $_DBname;
    protected $_Tempfile_path;

    function __construct()
    {
        $this -> set_database();
    }

    private function set_database() {
        $path = "/etc/php/8.1/cli/php.ini";
        $db_default = parse_ini_file($path);
        $this -> _DBhost = $db_default['mysqli.default_host'];
        $this -> _DBuser = $db_default['mysqli.default_user'];
        $this -> _DBpassword = $db_default['mysqli.default_pw'];
        $this -> _DBname = 'WSP';
        $this -> _Tempfile_path = $db_default['ptmp.path'];
    }
}

class WSPDB extends BaseDB {
    private $lifetime;
    private $patient_id;

    function __construct($stay_in = FALSE)
    {
        parent::__construct();
        $this -> set_lifetime($stay_in);
    }

    private function set_lifetime($stay_in) {
        if ($stay_in) {
            $this ->lifetime = 86400;
        }
    } 

    private function database_connect() {
        try {
            mysqli_connect(
                $this->_DBhost, $this->_DBuser,
                $this->_DBpassword, $this->_DBname);
        } catch (\Exception $e){
            $response['error_status'] = "Error: Database connection error!";
            exit(json_encode($response));
        }
    }

    public function check_login() {
        if (isset($this -> lifetime)) {
            $lifetime = 86400;
            ini_set("session.gc_maxlifetime", $lifetime);
        }
        session_save_path($this -> _Tempfile_path);
        session_start();
        if (isset($_SESSION['patientID'])) {
            $this -> patient_id = $_SESSION['patientID'];
            $this -> database_connect();
            return TRUE;
        }
        return FALSE;
    } 

    public function get_patient_id() {
        return $this -> patient_id ?: NULL;
    }
}
?>