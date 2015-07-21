/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';
	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var treeId = attrs.treeId;

				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

        //node checked
        var nodeChecked = attrs.nodeChecked || 'checked';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

        var checkboxSupport = attrs.checkboxSupport || 'false';

        var checkboxTemplate = '';
        if(checkboxSupport != 'false'){
          checkboxTemplate = '<input type="checkbox" ng-model="node.' + nodeChecked + '" ng-change="' + treeId + '.selectNodeCbx(node)"/> ';
        }

				//tree template
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + treeModel + '">' +
							'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
							'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">' + checkboxTemplate + '{{node.' + nodeLabel + '}}</span>' +
							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-checkbox-support=' + checkboxSupport + '></div>' +
						'</li>' +
					'</ul>';


				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

            //are we adding checkboxes?
            if(checkboxSupport != 'false') {
              scope[treeId].checkedNodes = scope[treeId].checkedNodes || [];
            }

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};

            //if node cbx clicks,
            scope[treeId].selectNodeCbx = scope[treeId].selectNodeCbx || function( selectedNode ){

                if(checkboxSupport == 'false')
                  return

                var isChecked = selectedNode[nodeChecked];

                if(isChecked && scope[treeId].checkedNodes.indexOf(selectedNode[nodeId]) == -1) {
                  scope[treeId].checkedNodes.push(selectedNode[nodeId]);
                }else if(!isChecked){
                  var index = scope[treeId].checkedNodes.indexOf(selectedNode[nodeId]);
                  if(index != -1){
                    scope[treeId].checkedNodes.splice(index, 1);
                  }
                }

                //look through the children and set them to this
                var children = selectedNode.children;

                for(var child in children){
                  children[child][nodeChecked] = isChecked;
                  //recurse child trees
                  scope[treeId].selectNodeCbx(children[child]);
                }
              };

					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
