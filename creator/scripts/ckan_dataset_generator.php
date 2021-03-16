<?php

   class Provider {
     public $id;
     public $name;
     public $url;

     public function  __construct($id, $name, $url) {
       $this->id = $id;
       $this->name = $name;
       $this->url = $url;
     }
   }

    function getCkanDatasets($data, $provider_id)
    {
        $filter = ['csv', 'ods', 'xls', 'xlsx'];

        $treemapdata = array();
        $datasets = $data['result']['results'];
        $datasetsCnt = count( $datasets );
        for ($i = 0; $i < $datasetsCnt; $i++) {
            $ds = $datasets[$i];
            $resourcesCnt = count($ds['resources']);
            $resources = array();
            for ($j = 0; $j < $resourcesCnt; $j++)
            {
               //if (strcasecmp($ds['resources'][$j]['format'], 'csv') == 0)

                if (in_array(strtolower($ds['resources'][$j]['format']), $filter))
                    $resources[] = $ds['resources'][$j]['name'];
                else
                    $resources[] = [$ds['resources'][$j]['name'], 'disabled'];

                if (count($resources) == 1)
                    $treemapdata[] = array(
                        'name' => $ds['title'] ? $ds['title'] : $ds['name'],
                        'id' => $ds['id'],
                        'p' => 'CKAN_' . $provider_id
                    );
                else if(count($resources) > 1)
                    $treemapdata[] = array(
                        'name' => $ds['title'] ? $ds['title'] : $ds['name'],
                        'id' => $ds['id'],
                        'p' => 'CKAN_' . $provider_id,
                        'resources' => $resources
                    );
            }
        }
        return $treemapdata;
    }

    function datasetsListBuilder($providers)
    {
        $step = 100;
        $maxDatasetPerProvider = 9999;
        $providersDatasets = [];

        foreach ($providers as $p) {

            $providerDatasetCounter = 0;
            $start = 0;

            // Build providers
            $providersDatasets[$p->id] = ['p_name' => $p->name, 'p_url' => $p->url, 'p_datasets' => []];

            // Try CKAN
            while($providerDatasetCounter < $maxDatasetPerProvider) {
                $ch = curl_init($p->url . "/api/3/action/package_search?start=" . $start . "&rows=" . $step);//1000 limit!
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $res = curl_exec($ch);
                $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                if (200 == $retcode)
                {
                    $data = json_decode($res, true);

                    if(count($data["result"]["results"]))
                    {
                        $a = getCkanDatasets($data, $p->id);
                        $l_a = count($a);
                        for($j = 0; $j < $l_a; $j++) {
                            $providersDatasets[$p->id]['p_datasets'][] = $a[$j];
                        }

                        $start += $step;
                        $providerDatasetCounter += count($data["result"]["results"]);
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    break;
                }
            }
        }

        return json_encode($providersDatasets);
    }

     $providers =  array(
                  new Provider(
                     "p1",
                     "REGIONE CAMPANIA",
                     "https://dati.regione.campania.it/ckan"
                  ),
                  new Provider(
                      "p2",
                      "ROUTE-TO-PA",
                      "http://ckan.routetopa.eu:8080"
                  )
            );

    echo "datasets = ".datasetsListBuilder($providers);
    echo "\nconst step = 100;";
    echo "\nconst max = 9999;";
    echo "\nconst providers = [";

    foreach($providers as $p)
       echo "{id:'".$p->id."', name:'".$p->name."', url:'".$p->url."'},";
    echo "];";
?>