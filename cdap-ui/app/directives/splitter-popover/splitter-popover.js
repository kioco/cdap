/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
*/

angular.module(PKG.name + '.commons')
  .directive('mySplitterPopover', function($popover, GLOBALS) {
    return {
      restrict: 'A',
      scope: {
        nodeName: '=',
        ports: '=',
        isDisabled: '='
      },
      link: function(scope, element) {
        const templateUrl = 'splitter-popover/splitter-popover.html';

        let targetElement = angular.element(element);
        targetElement.removeAttr('my-splitter-popover');
        targetElement.removeAttr('data-node-name');
        targetElement.removeAttr('data-ports');

        let splitterPopover;

        const createPopover = () => {
          if (!scope.ports || (scope.ports && !scope.ports.length) || (scope.ports[0].name === GLOBALS.defaultSchemaName)) {
            return;
          }

          splitterPopover = $popover(targetElement, {
            templateUrl,
            trigger: 'manual',
            placement: 'right',
            container: '.node-splitter-endpoint',
            customClass: 'my-splitter-popover',
            scope: scope,
            show: true
          });
        };

        const differentPorts = (newPorts, oldPorts) => {
          if (newPorts.length !== oldPorts.length) {
            return true;
          }

          for (let i = 0; i < newPorts.length; i++) {
            if (newPorts[i].name !== oldPorts[i].name || newPorts[i].schema !== oldPorts[i].schema) {
              return true;
            }
          }

          return false;
        };

        scope.$watch('ports', (newValue, oldValue) => {
          if (!splitterPopover) {
            createPopover();
          } else if (splitterPopover && differentPorts(newValue, oldValue)) {
            splitterPopover.destroy();
            splitterPopover = null;
            createPopover();
          }
        });
        scope.$on('$destroy', function () {
          if (splitterPopover) {
            splitterPopover.destroy();
            splitterPopover = null;
          }
        });

      }
    };
  });
