/*
* Auto generated file, do not tweak. 
*/
IMPORT STD;
IMPORT Taxi;
EXPORT ETLRecord := MODULE
    EXPORT field_layout := RECORD
        STRING name;
        STRING fieldType;
        STRING fieldsize;
        STRING displayType;
        STRING displaySize;
        STRING minValue;
        STRING maxValue;
        STRING format;
        STRING transforms;
        BOOLEAN isNullable;
        STRING textJustification;
    END;
    EXPORT file_meta_layout := RECORD 
        STRING name;
        STRING fileType;
        STRING filePath;
        STRING format;
        BOOLEAN isChildLayout;
        DATASET (field_layout) fields; 
    END;
    
	EXPORT coercedyellowLayout := RECORD 
		UNSIGNED1 vendorid;
		STRING19 tpep_pickup_datetime;
		STRING19 tpep_dropoff_datetime;
		UNSIGNED1 passenger_count;
		DECIMAL10_2 trip_distance;
		DECIMAL9_6 pickup_longitude;
		DECIMAL9_6 pickup_latitude;
		UNSIGNED1 rate_code_id;
		STRING1 store_and_fwd_flag;
		DECIMAL9_6 dropoff_longitude;
		DECIMAL9_6 dropoff_latitude;
		UNSIGNED1 payment_type;
		DECIMAL8_2 fare_amount;
		DECIMAL8_2 extra;
		DECIMAL8_2 mta_tax;
		DECIMAL8_2 tip_amount;
		DECIMAL8_2 tolls_amount;
		DECIMAL8_2 improvement_surcharge;
		DECIMAL8_2 total_amount;
 	END;

	EXPORT ETLRecordLayout := RECORD 
		UNSIGNED4 record_id;
		COERCEDYELLOWLayout coercedyellow;
 	END;

    EXPORT PATH :=  '~taxi_data::data';
                   

    
    EXPORT ETLRecordDs := DATASET(PATH, ETLRecordLayout, FLAT);

   
    
    EXPORT ETLRecordMeta := DATASET([{'name','fileType', 'filePath', 'format', 'isChildLayout', 
                    [{'name', 'fieldType', 'fieldsize', 'displayType', 'displaySize', 'minValue', 'maxValue'
                    , 'format', 'isNullable', 'transforms', 'textJustification'}]}], file_meta_layout);
    //Visualize
END;