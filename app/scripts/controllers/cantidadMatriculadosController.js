'use strict';

/**
 * @ngdoc function
 * @name proyectoSDS.controller:CantidadMatriculadosCtrl
 * @description
 * # CantidadMatriculadosCtrl
 * Controller of the proyectoSDS
 */
angular.module('proyectoSDS')
    .controller('CantidadMatriculadosCtrl', function ($scope,$http) {
        //Se setean valores para la vista por defecto
        $scope.carreraSelected = "INGENIERIA CIVIL EN INFORMATICA";
        $scope.institucionSelected = "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA";
        $scope.regionSelected = "V REGIÓN";
        $scope.horarioSelected = "DIURNO";
        $scope.anioSelected = "2010.0";

        /**
         * Función encargada de buscar los datos de los matriculados dependiendo de los valores que contengan los atributos
         * regionSelected, anioSelected, horarioSelected, institucionSelected y carreraSelected de la variable $scope
         **/
        $scope.crearQuery = function crearQuery(){
            var query = 'PREFIX ex: <http://example.org/>'
            +'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'
            +'SELECT ?nombreInstitucion ?nombreCarrera ?region ?totalMatriculados ?totalMatriculadosFemeninos ?totalMatriculadosMasculinos ?horario ?anio {'
            +' ?x rdf:type ex:CantidadMatriculados. '
            +' ?x ex:institucion ?i. '
            +' ?x ex:carrera ?c. '
            +' ?x ex:region ?region. ';
            if($scope.regionSelected != 'TODAS') query +=' ?x ex:region \''+$scope.regionSelected+'\'.';
            query +=' ?x ex:totalMatriculados ?totalMatriculados.'
            +' ?x ex:totalFemeninos ?totalMatriculadosFemeninos.'
            +' ?x ex:totalMasculinos ?totalMatriculadosMasculinos.'
            +' ?x ex:anio ?anio.';
            if($scope.anioSelected != 'TODOS') query +=' ?x ex:anio \''+$scope.anioSelected+'\'.';
            query += ' ?x ex:horario ?horario.';
            if($scope.horarioSelected != 'TODOS') query += ' ?x ex:horario \''+$scope.horarioSelected+'\'.';
            query += ' ?i ex:nombre \''+$scope.institucionSelected+'\'.'
            +' ?i ex:nombre ?nombreInstitucion.'
            +' ?c ex:nombre \''+$scope.carreraSelected+'\'.'
            +' ?c ex:nombre ?nombreCarrera.}'
            +' ORDER BY ?nombreInstitucion ?nombreCarrera';

            $http.jsonp("http://localhost:3030/ds/query?query="+encodeURIComponent(query)+"&output=json&callback=JSON_CALLBACK")
                .success(function(response) {
                    $scope.cantidadMatriculados = response.results.bindings;
                }).error(function(){
                    console.log("Error al ejecutar la consulta");
                });
        }

        // Se cargan los datos de las instituciones para rellenar el campo select de instituciones del filtro de búsqueda
        var queryInstituciones = encodeURIComponent('PREFIX ex: <http://example.org/>' +
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
        'SELECT ?nombreInstitucion {' +
        ' ?i rdf:type ex:Institucion. ' +
        ' ?i ex:nombre ?nombreInstitucion}' +
        ' ORDER BY ?nombreInstitucion');

        $http.jsonp("http://localhost:3030/ds/query?query="+queryInstituciones+"&output=json&callback=JSON_CALLBACK")
            .success(function(response) {
                $scope.instituciones = response.results.bindings;
            }).error(function(){
                console.log("Error al ejecutar la consulta de instituciones");
        });

        // Se cargan los datos de las carreras perteneecientes a la USM (institucion por defecto) para rellenar el campo
        // select de carreras del filtro de busqueda
        var queryCarreras = encodeURIComponent('PREFIX ex: <http://example.org/>' +
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
        'SELECT DISTINCT ?nombreCarrera {' +
        ' ?x rdf:type ex:CantidadMatriculados. ' +
        ' ?x ex:institucion ?i. ' +
        ' ?x ex:carrera ?c. ' +
        ' ?i ex:nombre \'UNIVERSIDAD TECNICA FEDERICO SANTA MARIA\'.' +
        ' ?c ex:nombre ?nombreCarrera}' +
        ' ORDER BY ?nombreCarrera');

        $http.jsonp("http://localhost:3030/ds/query?query="+queryCarreras+"&output=json&callback=JSON_CALLBACK")
            .success(function(response) {
                $scope.carreras = response.results.bindings;
            }).error(function(){
                console.log("Error al ejecutar la consulta de carreras");
        });

        // Se actualizan las carreras del select de carreras (se utiliza cuando cambia el valor del select de instituciones)
        $scope.actualizarCarreras = function(){
          var queryCarreras = encodeURIComponent('PREFIX ex: <http://example.org/>' +
            'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
            'SELECT DISTINCT ?nombreCarrera {' +
            ' ?x rdf:type ex:CantidadMatriculados. ' +
            ' ?x ex:institucion ?i. ' +
            ' ?x ex:carrera ?c. ' +
            ' ?i ex:nombre \''+$scope.institucionSelected+'\'.' +
            ' ?c ex:nombre ?nombreCarrera}' +
            ' ORDER BY ?nombreCarrera');

            $http.jsonp("http://localhost:3030/ds/query?query="+queryCarreras+"&output=json&callback=JSON_CALLBACK")
                .success(function(response) {
                    $scope.carreras = response.results.bindings;
                    $scope.carreraSelected = $scope.carreras[0].nombreCarrera.value;
                    $scope.regionSelected = "TODAS";
                    $scope.horarioSelected = "TODOS";
                    $scope.anioSelected = "TODOS";
                    $scope.crearQuery();
                }).error(function(){
                    console.log("Error al ejecutar la consulta de carreras");
            });
        }

        //Se ejecuta la funcion crearQuery para rellenar la tabla de datos al cargar la vista
        $scope.crearQuery();
  });
