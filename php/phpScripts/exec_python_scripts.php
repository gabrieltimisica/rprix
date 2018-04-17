<?php
$path_to_file = '';
$id_senzor = 1;

switch($id_senzor)
{
    case 1:
    {
        $path_to_file = 'python /home/pi/Licenta/Senzori/SenzorTemp.py';
        break;
    }
    case 2:
    {
        $path_to_file = 'python /home/pi/Licenta/Senzori/SenzorUmid.py';
        break;
    }
    case 3:
    {
        $path_to_file = 'python /home/pi/Licenta/Senzori/SenzorLum.py';
        break;
    }
    break;
}
$command = escapeshellcmd($path_to_file);
$out = shell_exec($command);
echo $out;
?>





