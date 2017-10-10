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
  .directive('mySplitterPopover', function($popover, GLOBALS, $timeout) {
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
        let delayOpenTimer;

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
            scope: scope
          });

          splitterPopover.$promise
            .then(() => {
              showPopover();
            });
        };

        // Need to do this because for some reason calling show() immediately will not place the popup
        // at the right position
        const showPopover = () => {
          cancelTimer();
          delayOpenTimer = $timeout(splitterPopover.show);
        };

        const cancelTimer = () => {
          if (delayOpenTimer) {
            $timeout.cancel(delayOpenTimer);
          }
        };

        scope.$watch('ports', (newValue, oldValue) => {
          if (!splitterPopover) {
            createPopover();
          } else if (newValue && oldValue && newValue.length !== oldValue.length) {
            splitterPopover.hide();
            showPopover();
          }
        });
        scope.$on('$destroy', function () {
          if (splitterPopover) {
            splitterPopover.destroy();
            splitterPopover = null;
          }
          cancelTimer();
        });

      }
    };
  });
