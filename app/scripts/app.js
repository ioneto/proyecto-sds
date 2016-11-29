'use strict';

/**
 * @ngdoc overview
 * @name angularBlogApp
 * @description
 * # angularBlogApp
 *
 * Main module of the application.
 */
angular
  .module('proyectoSDS', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/cantidadMatriculados.html',
        controller: 'CantidadMatriculadosCtrl',
        controllerAs: 'cantidadMatriculadosController'
      })
      .when('/cantidadMatriculados', {
      templateUrl: 'views/cantidadMatriculados.html',
      controller: 'CantidadMatriculadosCtrl',
      controllerAs: 'cantidadMatriculadosController'
      })
      .when('/cantidadTitulados', {
        templateUrl: 'views/cantidadTitulados.html',
        controller: 'CantidadTituladosCtrl',
        controllerAs: 'cantidadTituladosController'
      })
      .otherwise({
        redirectTo: '/'
      });

      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common["X-Requested-With"];
      $httpProvider.defaults.headers.common["Accept"] = "application/json";
      $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

      $(".nav a").on("click", function(){
      $(".nav").find(".active").removeClass("active");
      $(this).parent().addClass("active");
    });

  });
