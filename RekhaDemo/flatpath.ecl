/*
* Auto generated file, do not tweak. 
*/
IMPORT STD;
IMPORT RekhaDemo;
EXPORT flatpath := MODULE
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
    

	EXPORT flatpathLayout := RECORD 
		STRING151 contents;
 	END;

    EXPORT PATH :=  '~.::onlinelessonpersons';
                   

    
    EXPORT flatpathDs := DATASET(PATH, flatpathLayout, FLAT);

   
    
    EXPORT flatpathMeta := DATASET([{'name','fileType', 'filePath', 'format', 'isChildLayout', 
                    [{'name', 'fieldType', 'fieldsize', 'displayType', 'displaySize', 'minValue', 'maxValue'
                    , 'format', 'isNullable', 'transforms', 'textJustification'}]}], file_meta_layout);
    //Visualize
END;