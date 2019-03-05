/*
* Auto generated file, do not tweak. 
*/
IMPORT STD;
IMPORT Taxi;
EXPORT FlatWeatherRecord := MODULE
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
    

	EXPORT FlatWeatherRecordLayout := RECORD 
		UNSIGNED4 date;
		INTEGER8 minutes_after_midnight;
		STRING summary;
		UDECIMAL6_3 temperature;
		UDECIMAL6_3 precipintensity;
		STRING preciptype;
		UDECIMAL4_2 windspeed;
		UDECIMAL4_2 visibility;
		UDECIMAL4_2 cloudcover;
 	END;

    EXPORT PATH :=  '~taxi_data::weather_new_york_city';
                   

    
    EXPORT FlatWeatherRecordDs := DATASET(PATH, FlatWeatherRecordLayout, FLAT);

   
    
    EXPORT FlatWeatherRecordMeta := DATASET([{'name','fileType', 'filePath', 'format', 'isChildLayout', 
                    [{'name', 'fieldType', 'fieldsize', 'displayType', 'displaySize', 'minValue', 'maxValue'
                    , 'format', 'isNullable', 'transforms', 'textJustification'}]}], file_meta_layout);
    //Visualize

    FlatWeatherRecordDs;
END;